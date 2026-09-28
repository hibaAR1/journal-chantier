import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "../../ui/dropdown-menu.jsx";
import {Button} from "../../ui/button.jsx";
import {LuTable} from "react-icons/lu";
import TableActionBtn from "../table-action-btn/table-action-btn.jsx";

const TableVisibleComponent = ({table, list}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="primaryOutline" className="justify-start items-center gap-2">
                    <LuTable />
                    <span className="hidden md:inline">Colonnes</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                    .getAllColumns()
                    .filter(
                        (column) => column.getCanHide()
                    )
                    .map((column, index) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                }
                            >
                                {list[index]}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default TableVisibleComponent;
