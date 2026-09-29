import { useState } from "react";
import { format } from "date-fns";
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

/**
 * Filtres du suivi historique : chantier + période (plage de dates).
 * period = { from: Date, to: Date }
 */
const DashboardHistoryFiltersLayout = ({
  sites,
  siteId,
  period,
  onSiteChange,
  onPeriodChange,
}) => {
  const selectedSite = sites.find((site) => site.value === siteId);

  // Les listes se referment dès qu'un choix est fait
  const [siteOpen, setSiteOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const periodLabel = period?.from
    ? `Du ${format(period.from, "dd/MM/yyyy")} au ${format(period.to ?? period.from, "dd/MM/yyyy")}`
    : "Sélectionner une période";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Sélecteur chantier */}
      <Popover open={siteOpen} onOpenChange={setSiteOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="primaryControl"
            role="combobox"
            className="w-auto min-w-[220px] justify-between"
          >
            {selectedSite ? selectedSite.label : "Sélectionner chantier"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher un chantier" />
            <CommandList>
              <CommandEmpty>Aucun chantier trouvé.</CommandEmpty>
              <CommandGroup>
                {sites.map((site) => (
                  <CommandItem
                    key={site.value}
                    value={site.label}
                    onSelect={() => {
                      onSiteChange(site.value);
                      setSiteOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        site.value === siteId ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {site.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Sélecteur période (du … au …) */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="primaryControl" className="w-auto min-w-[240px]">
            {periodLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            locale={fr}
            numberOfMonths={2}
            selected={period}
            onSelect={(value, clickedDay) => {
              // Si une période complète est déjà affichée, un nouveau clic
              // commence une NOUVELLE période (1er clic = début, 2e clic = fin).
              // Cliquer 2 fois sur le même jour = une seule journée.
              const next =
                period?.from && period?.to
                  ? { from: clickedDay, to: undefined }
                  : value;

              onPeriodChange(next);

              // On referme quand la période est complète (du … au …)
              if (next?.from && next?.to) setDateOpen(false);
            }}
            disabled={(day) => day > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardHistoryFiltersLayout;
