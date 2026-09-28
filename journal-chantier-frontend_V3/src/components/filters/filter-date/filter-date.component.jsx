import {useState} from "react";

import {format} from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {FiDelete} from "react-icons/fi";

const FilterDateComponent = ({className, column}) => {
    const [date, setDate] = useState({
        from: '',
        to: '',
    });

    const handleChange = ({from, to}) => {

        setDate({from, to});

        column.setFilterValue([from, to]);
    };

    const clearDate = () => {
        setDate({
            from: '',
            to: '',
        });

        column.setFilterValue(['', '']);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "text-xs font-medium text-primary-950 hover:text-primary-900 hover:bg-white",
                            date?.from && 'flex justify-between items-center px-2'
                        )}
                        size="sm"
                    >
                        {date?.from ? (
                            date.to ? (
                                <>
                                    <span>
                                        {format(date.from, "dd-MM-yyyy")} -{" "}
                                        {format(date.to, "dd-MM-yyyy")}
                                    </span>
                                    <FiDelete onClick={clearDate}/>
                                </>
                            ) : (
                                <>
                                    <span>
                                        {format(date.from, "dd-MM-yyyy")}
                                    </span>
                                    <FiDelete onClick={clearDate}/>
                                </>

                            )
                        ) : (
                            <span>Sélectionner</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleChange}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
};

export default FilterDateComponent;
