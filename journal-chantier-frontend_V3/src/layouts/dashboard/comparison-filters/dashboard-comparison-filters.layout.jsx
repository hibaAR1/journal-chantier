import { useState } from "react";
import { fr } from "date-fns/locale";
import { Check, ChevronsUpDown } from "lucide-react";

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

// Sélecteur "Période : Jour ▾" (cahier des charges § 2.4) : une journée, choisie dans le calendrier
export const PERIOD_TYPES = [{ value: "day", label: "Jour" }];
/**
 * Filtres du comparatif multi-chantiers, comme dans le cahier des charges :
 *  - "Période : Jour ▾"     → type de période (à gauche) + calendrier (à droite) ;
 *  - "N chantiers actifs ▾" → recherche et choix des chantiers à comparer (tous par défaut).
 *
 * periodType = "day" | "week" | "month" | "custom"
 * period     = { from: Date, to: Date }  (période calculée)
 * activeSites = [{ id, name }] — selectedSiteIds = [id…] (vide = tous)
 */
const DashboardComparisonFiltersLayout = ({
  periodType,
  period,
  activeSites,
  selectedSiteIds,
  onPeriodTypeChange,
  onDateChange,
  onRangeChange,
  onSitesChange,
}) => {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [sitesOpen, setSitesOpen] = useState(false);

  const typeLabel = PERIOD_TYPES.find(
    (type) => type.value === periodType,
  )?.label;

  // Aucun chantier coché = tous les chantiers actifs
  const allSelected = selectedSiteIds.length === 0;
  const isChecked = (id) => allSelected || selectedSiteIds.includes(id);
  const checkedCount = allSelected
    ? activeSites.length
    : activeSites.filter((site) => selectedSiteIds.includes(site.id)).length;

  const toggleSite = (id) => {
    const current = allSelected
      ? activeSites.map((site) => site.id)
      : selectedSiteIds;
    const next = current.includes(id)
      ? current.filter((siteId) => siteId !== id)
      : [...current, id];

    // Tout coché (ou rien) = revenir à "tous"
    onSitesChange(
      next.length === activeSites.length || next.length === 0 ? [] : next,
    );
  };

  const sitesLabel = allSelected
    ? `${activeSites.length} chantier${activeSites.length > 1 ? "s" : ""} actif${activeSites.length > 1 ? "s" : ""}`
    : `${checkedCount} / ${activeSites.length} chantiers`;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Sélecteur "Période : Jour ▾" : type de période + date */}
      <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="primaryControl"
            role="combobox"
            className="w-auto min-w-[170px] justify-between"
          >
            Période : {typeLabel}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="end">
          {/* Type de période */}
          <div className="flex flex-col gap-1 p-2 border-r border-primary-100 min-w-[140px]">
            {PERIOD_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onPeriodTypeChange(type.value)}
                className={cn(
                  "flex items-center rounded-sm px-2 py-1.5 text-sm text-left hover:bg-primary-50",
                  type.value === periodType && "font-semibold",
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    type.value === periodType ? "opacity-100" : "opacity-0",
                  )}
                />
                {type.label}
              </button>
            ))}
          </div>

          {/* Date : un jour (Jour / Semaine / Mois) ou du … au … (Personnalisée) */}
          {periodType === "custom" ? (
            <Calendar
              mode="range"
              locale={fr}
              numberOfMonths={2}
              selected={period}
              onSelect={(value, clickedDay) => {
                // Si une période complète est déjà affichée, un nouveau clic
                // commence une NOUVELLE période (1er clic = début, 2e clic = fin).
                const next =
                  period?.from && period?.to
                    ? { from: clickedDay, to: undefined }
                    : value;

                onRangeChange(next);

                if (next?.from && next?.to) setPeriodOpen(false);
              }}
              disabled={(day) => day > new Date()}
              initialFocus
            />
          ) : (
            <Calendar
              mode="single"
              locale={fr}
              weekStartsOn={1}
              selected={period?.from}
              defaultMonth={period?.from}
              onSelect={(value) => {
                // Semaine / Mois : on choisit n'importe quel jour, la période est calculée
                if (value) {
                  onDateChange(value);
                  setPeriodOpen(false);
                }
              }}
              disabled={(day) => day > new Date()}
              initialFocus
            />
          )}
        </PopoverContent>
      </Popover>

      {/* Sélecteur "N chantiers actifs ▾" : recherche + cases à cocher */}
      <Popover open={sitesOpen} onOpenChange={setSitesOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="primaryControl"
            role="combobox"
            className="w-auto min-w-[190px] justify-between"
          >
            {sitesLabel}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Rechercher un chantier" />
            <CommandList>
              <CommandEmpty>Aucun chantier trouvé.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="Tous les chantiers"
                  onSelect={() => onSitesChange([])}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={allSelected}
                    className="mr-2"
                  />
                  Tous les chantiers
                </CommandItem>
                {activeSites.map((site) => (
                  <CommandItem
                    key={site.id}
                    value={site.name}
                    onSelect={() => toggleSite(site.id)}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={isChecked(site.id)}
                      className="mr-2"
                    />
                    {site.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardComparisonFiltersLayout;
