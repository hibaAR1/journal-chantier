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
 * Filtres du comparatif multi-chantiers : période + tâche comparée.
 * period = { from: Date, to: Date } — tasks = [{ id, name, unit }]
 */
const DashboardComparisonFiltersLayout = ({
  period,
  tasks,
  workTypeId,
  onPeriodChange,
  onTaskChange,
}) => {
  const selectedTask = tasks.find((task) => task.id === workTypeId);

  // Les listes se referment dès qu'un choix est fait
  const [dateOpen, setDateOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  const periodLabel = !period?.from
    ? "Sélectionner une période"
    : !period.to ||
        format(period.from, "yyyy-MM-dd") === format(period.to, "yyyy-MM-dd")
      ? `Journée du ${format(period.from, "dd/MM/yyyy")}`
      : `Du ${format(period.from, "dd/MM/yyyy")} au ${format(period.to, "dd/MM/yyyy")}`;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Sélecteur période (un jour ou du … au …) */}
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

      {/* Sélecteur tâche (pour le diagramme "Comparaison d'une tâche") */}
      <Popover open={taskOpen} onOpenChange={setTaskOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="primaryControl"
            role="combobox"
            className="w-auto min-w-[220px] justify-between"
          >
            {selectedTask
              ? `Tâche : ${selectedTask.name} (${selectedTask.unit ?? "–"})`
              : "Sélectionner une tâche"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher une tâche" />
            <CommandList>
              <CommandEmpty>Aucune tâche sur la période.</CommandEmpty>
              <CommandGroup>
                {tasks.map((task) => (
                  <CommandItem
                    key={task.id}
                    value={task.name}
                    onSelect={() => {
                      onTaskChange(task.id);
                      setTaskOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        task.id === workTypeId ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {task.name} ({task.unit ?? "–"})
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
