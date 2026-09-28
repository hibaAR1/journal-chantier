import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "../../ui/popover.jsx";
import {Button} from "../../ui/button.jsx";
import {cn} from "../../../lib/utils.js";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../../ui/command.jsx";

const SelectSearchComponent = (form, items, valueName, valueTitle) => {
    return (
        <FormField
            control={form.control}
            name={valueName}
            render={({field}) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{valueTitle}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="blackOutline"
                                    role="combobox"
                                    className={cn(
                                        "w-[100%] justify-between hover:bg-transparent hover:text-black px-3 font-normal"
                                    )}
                                >
                                    {field.value
                                        ? items.find(
                                            (item) => item.value === field.value
                                        )?.label
                                        : `Sélectionner ${valueTitle}`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[100%] p-0">
                            <Command>
                                <CommandInput placeholder={`Rechercher ${valueTitle}...`}/>
                                <CommandList>
                                    <CommandEmpty>Aucun element trouvé.</CommandEmpty>
                                    <CommandGroup>
                                        {items.map((item) => (
                                            <CommandItem
                                                value={item.label}
                                                key={item.value}
                                                onSelect={() => {
                                                    form.setValue(valueName, item.value)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        item.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {item.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
};

export default SelectSearchComponent;
