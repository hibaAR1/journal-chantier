import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronsUpDown } from "lucide-react";
import { FiDownload, FiLoader } from "react-icons/fi";

import PunchDetailsApis from "../../../apis/punch-details.apis.jsx";
import { usePunchesContext } from "../../../context/punches/punches.context.jsx";
import { useToast } from "../../../hooks/use-toast.js";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import { Button } from "../../../components/ui/button.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover.jsx";
import { Calendar } from "../../../components/ui/calendar.jsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command.jsx";

import { cn } from "../../../lib/utils.js";

// "Par période" (cahier des charges § 3.2.4) ou "Par jour" (demande du superviseur)
const MODES = [
  { value: "period", label: "Par période" },
  { value: "day", label: "Par jour" },
];

/**
 * Sélecteur de date (bouton + calendrier), réutilisé pour "Date début", "Date fin" et "Jour".
 */
const DateField = ({ label, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="primaryControl" type="button">
            {format(value, "dd/MM/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={fr}
            selected={value}
            defaultMonth={value}
            onSelect={(day) => {
              if (day) {
                onChange(day);
                setOpen(false);
              }
            }}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

/**
 * Export Pointage Détaillé — Format Excel (cahier des charges V3 — § 3.2.4).
 * Bouton dédié "Exporter Excel" → panneau : Par période / Par jour, dates, chantiers (Tous / Multi), format .xlsx.
 */
const PunchesExportLayout = () => {
  const { sites } = usePunchesContext();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [sitesOpen, setSitesOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const today = new Date();

  const [mode, setMode] = useState("period");
  const [from, setFrom] = useState(startOfMonth(today)); // Défaut : 1er jour du mois
  const [to, setTo] = useState(today); // Défaut : date du jour
  const [day, setDay] = useState(today);
  const [siteIds, setSiteIds] = useState([]); // vide = tous les chantiers

  const isFuture = (date) => date > new Date();

  const toggleSite = (id) => {
    setSiteIds((current) =>
      current.includes(id)
        ? current.filter((siteId) => siteId !== id)
        : [...current, id],
    );
  };

  const sitesLabel =
    siteIds.length === 0
      ? "Tous les chantiers"
      : `${siteIds.length} chantier${siteIds.length > 1 ? "s" : ""} sélectionné${siteIds.length > 1 ? "s" : ""}`;

  const handleExport = async () => {
    const start = format(mode === "day" ? day : from, "yyyy-MM-dd");
    const end = format(mode === "day" ? day : to, "yyyy-MM-dd");

    if (end < start) {
      toast({
        variant: "danger",
        title: "Période invalide",
        description: "La date de fin doit être après la date de début.",
      });
      return;
    }

    setExporting(true);

    await PunchDetailsApis.exportExcel({
      from: start,
      to: end,
      site_ids: siteIds.length ? siteIds : undefined,
    })
      .then(({ data }) => {
        // Téléchargement du fichier .xlsx
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.download =
          start === end
            ? `Pointage_detaille_${start}.xlsx`
            : `Pointage_detaille_${start}_au_${end}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setIsOpen(false);
      })
      .catch(async (error) => {
        // La réponse d'erreur est aussi un "blob" : on lit le message JSON dedans
        let message = "Impossible de générer le fichier Excel.";
        try {
          const json = JSON.parse(await error?.response?.data?.text());
          message = json.message ?? message;
        } catch {
          /* message par défaut */
        }
        if (error?.response?.status === 403) {
          message = "Vous n'avez pas le droit d'exporter le pointage détaillé.";
        }
        toast({
          variant: "danger",
          title: "Export impossible",
          description: message,
        });
      })
      .finally(() => setExporting(false));
  };

  return (
    <SheetFormLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Export pointage détaillé"
      btn={
        <Button variant="primaryOutline" className="justify-start gap-2">
          <FiDownload />
          <span className="hidden md:inline">Exporter Excel</span>
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Par période / Par jour */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Type d&apos;export</span>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map((item) => (
              <Button
                key={item.value}
                type="button"
                variant={mode === item.value ? "primary" : "primaryOutline"}
                onClick={() => setMode(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Dates */}
        {mode === "period" ? (
          <>
            <DateField
              label="Date début"
              value={from}
              onChange={setFrom}
              disabled={isFuture}
            />
            <DateField
              label="Date fin"
              value={to}
              onChange={setTo}
              disabled={isFuture}
            />
          </>
        ) : (
          <DateField
            label="Jour"
            value={day}
            onChange={setDay}
            disabled={isFuture}
          />
        )}

        {/* Chantier : Tous / Multi */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Chantier</span>
          <Popover open={sitesOpen} onOpenChange={setSitesOpen}>
            <PopoverTrigger asChild>
              <Button variant="primaryControl" role="combobox" type="button">
                {sitesLabel}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher un chantier" />
                <CommandList>
                  <CommandEmpty>Aucun chantier trouvé.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="Tous les chantiers"
                      onSelect={() => setSiteIds([])}
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={siteIds.length === 0}
                        className="mr-2"
                      />
                      Tous les chantiers
                    </CommandItem>
                    {sites.map((site) => (
                      <CommandItem
                        key={site.value}
                        value={site.label}
                        onSelect={() => toggleSite(site.value)}
                      >
                        <input
                          type="checkbox"
                          readOnly
                          checked={siteIds.includes(site.value)}
                          className="mr-2"
                        />
                        {site.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Format imposé */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Format</span>
          <p
            className={cn(
              "text-sm rounded border border-primary-100 px-3 py-2 bg-primary-50",
            )}
          >
            Excel (.xlsx)
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          disabled={exporting}
          onClick={handleExport}
          className="gap-2"
        >
          {exporting ? <FiLoader className="animate-spin" /> : <FiDownload />}
          Exporter
        </Button>
      </div>
    </SheetFormLayout>
  );
};

export default PunchesExportLayout;
