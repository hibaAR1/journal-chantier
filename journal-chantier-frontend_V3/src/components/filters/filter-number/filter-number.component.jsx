import {useState} from "react";

import {Input} from "../../ui/input.jsx";

const FilterNumberComponent = ({column, placeholders = ['Min', 'Max']}) => {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    return (
        <div className="flex justify-between items-center gap-1 w-[100%]">
            <Input
                type="number"
                value={min}
                onChange={(e) => {
                    const val = e.target.value;
                    setMin(val);
                    column.setFilterValue((old = []) => [
                        val ? Number(val) : undefined,
                        old[1],
                    ]);
                }}
                placeholder={placeholders[0]}
            />
            <Input
                type="number"
                value={max}
                onChange={(e) => {
                    const val = e.target.value;
                    setMax(val);
                    column.setFilterValue((old = []) => [
                        old[0],
                        val ? Number(val) : undefined,
                    ]);
                }}
                placeholder={placeholders[1]}
            />
        </div>
    )
};

export default FilterNumberComponent;
