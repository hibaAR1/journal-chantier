import { Link } from "react-router-dom";
import { FiKey } from "react-icons/fi";
import {Button} from "../../ui/button.jsx";

const RolesLinkComponent = () => {
    return (
        <Link to="/roles">
            <Button variant="primaryOutline" className="justify-start gap-2">
                <FiKey />
                <span className="hidden md:inline">Rôles</span>
            </Button>
        </Link>
    );
};

export default RolesLinkComponent;
