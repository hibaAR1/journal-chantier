import {useEffect, useState} from "react";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ui/select.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "../../ui/popover.jsx";
import {Command, CommandInput, CommandItem, CommandList} from "../../ui/command.jsx";
import {Button} from "../../ui/button.jsx";

const FilterSelectComponent = ({column, placeholder, options}) => {

    const [selectedValues, setSelectedValues] = useState([]); // Default: all values selected
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const getAllOptionValues = () => {
            const values = options.map(({value}) => value)

            setSelectedValues(values);
        };

        getAllOptionValues();
    }, []);

    const handleChange = (value) => {
        const currentValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value) // Remove if already selected
            : [...selectedValues, value]; // Add if not selected

        setSelectedValues(currentValues);
        // Update the table filter with the selected values
        column.setFilterValue(currentValues.length ? currentValues : undefined);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='primaryOutline' className="w-full text-xs font-medium hover:text-primary-400 hover:bg-white" size="sm">
                    Sélectionner
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        {options.map(({value, name}) => (
                            <CommandItem
                                key={value}
                                onSelect={() => handleChange(value)}
                                className={`cursor-pointer ${selectedValues.includes(value) ? 'bg-primary-200' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(value)}
                                    onChange={() => handleChange(value)}
                                    className="mr-2"
                                />
                                {name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
};

export default FilterSelectComponent;
