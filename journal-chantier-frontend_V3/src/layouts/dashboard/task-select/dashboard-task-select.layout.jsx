import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "../../../components/ui/button.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover.jsx";
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
 * Sélecteur "Tâche : Maçonnerie (M2) ▾" placé à côté du titre
 * "Comparaison d'une tâche" (cahier des charges § 2.4).
 */
const DashboardTaskSelectLayout = ({ tasks, workTypeId, onTaskChange }) => {
  const [open, setOpen] = useState(false);

  const selectedTask = tasks.find((task) => task.id === workTypeId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="primaryControl"
          role="combobox"
          className="w-auto min-w-[200px] justify-between"
        >
          {selectedTask
            ? `Tâche : ${selectedTask.name} (${selectedTask.unit ?? "–"})`
            : "Sélectionner une tâche"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="end">
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
                    setOpen(false);
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
  );
};

export default DashboardTaskSelectLayout;
