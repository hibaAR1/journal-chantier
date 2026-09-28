import {Button} from "../../ui/button.jsx";
import {FiRefreshCw } from "react-icons/fi";

const TableRefreshBtnComponent = ({onClick}) => {
    return (
        <Button
            variant="primaryOutline"
            className="justify-start gap-2"
            onClick={onClick}
        >
            <FiRefreshCw/>
            <span className="hidden md:inline">Rafraîchir</span>
        </Button>
    )
};

export default TableRefreshBtnComponent;
