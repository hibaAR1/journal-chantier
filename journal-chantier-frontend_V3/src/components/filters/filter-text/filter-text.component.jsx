import {Input} from "../../ui/input.jsx";

const FilterTextComponent = ({column, placeholder}) => {
    return (
        <Input
            value={(column.getFilterValue() ?? '')}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Rechercher"
        />
    )
};

export default FilterTextComponent;
