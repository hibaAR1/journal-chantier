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
 * Filtres de la base de prix : catégorie de travaux + période historique.
 * categories = [{ id, name, unit }] — period = { from: Date, to: Date } ou undefined (tout l'historique)
 */
const DashboardPricesFiltersLayout = ({
  categories,
  workId,
  period,
  onCategoryChange,
  onPeriodChange,
}) => {
  const selectedCategory = categories.find(
    (category) => category.id === workId,
  );

  // Les listes se referment dès qu'un choix est fait
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const periodLabel = period?.from
    ? `Du ${format(period.from, "dd/MM/yyyy")} au ${format(period.to ?? period.from, "dd/MM/yyyy")}`
    : "Période historique : tout";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Sélecteur catégorie de travaux */}
      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="primaryControl"
            role="combobox"
            className="w-auto min-w-[240px] justify-between"
          >
            {selectedCategory
              ? selectedCategory.name
              : "Catégorie de travaux : toutes"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher une catégorie" />
            <CommandList>
              <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="Toutes les catégories"
                  onSelect={() => {
                    onCategoryChange(null);
                    setCategoryOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !workId ? "opacity-100" : "opacity-0",
                    )}
                  />
                  Toutes les catégories
                </CommandItem>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      onCategoryChange(category.id);
                      setCategoryOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        category.id === workId ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Sélecteur période historique (vide = tout l'historique) */}
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
            onSelect={(value) => {
              onPeriodChange(value);
              // On referme quand la période est complète (du … au …)
              if (value?.from && value?.to) setDateOpen(false);
            }}
            disabled={(day) => day > new Date()}
            initialFocus
          />
          {period?.from && (
            <div className="p-3 pt-0">
              <Button
                variant="primaryOutline"
                className="w-full"
                onClick={() => {
                  onPeriodChange(undefined);
                  setDateOpen(false);
                }}
              >
                Tout l&apos;historique
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardPricesFiltersLayout;
