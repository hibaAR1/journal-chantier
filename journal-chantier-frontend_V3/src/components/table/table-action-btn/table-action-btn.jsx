import {Button} from "../../ui/button.jsx";

const TableActionBtn = ({icon, text, onClick}) => {
    return (
        <Button
            variant="primaryOutline"
            className="justify-start gap-2"
            onClick={onClick}
        >
            {icon}
            <span className="hidden md:inline"></span>
        </Button>
    )
};

export default TableActionBtn;
