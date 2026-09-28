import { Link } from "react-router-dom";
import { FiShield } from "react-icons/fi";  // Icône clé / bouclier pour permissions
import { Button } from "../../ui/button.jsx";

const PermissionsLinkComponent = () => {
    return (
        <Link to="/permissions">
            <Button variant="primaryOutline" className="justify-start gap-2">
                <FiShield />
                <span className="hidden md:inline">Permissions</span>
            </Button>
        </Link>
    );
};

export default PermissionsLinkComponent;
