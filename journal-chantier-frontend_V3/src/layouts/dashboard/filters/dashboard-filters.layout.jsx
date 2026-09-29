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
 * Sélecteur chantier + sélecteur date du tableau de bord journalier.
 */
const DashboardFiltersLayout = ({
  sites,
  siteId,
  date,
  onSiteChange,
  onDateChange,
}) => {
  const selectedSite = sites.find((site) => site.value === siteId);

  // Les listes se referment dès qu'un choix est fait
  const [siteOpen, setSiteOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

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

      {/* Sélecteur date */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="primaryControl" className="w-auto min-w-[170px]">
            {date ? format(date, "dd/MM/yyyy") : "Sélectionner une date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            locale={fr}
            selected={date}
            onSelect={(value) => {
              if (value) {
                onDateChange(value);
                setDateOpen(false);
              }
            }}
            disabled={(day) => day > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardFiltersLayout;
