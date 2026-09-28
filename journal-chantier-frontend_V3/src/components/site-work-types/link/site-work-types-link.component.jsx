import {Link} from "react-router-dom";

import {FiList} from "react-icons/fi";
import {Button} from "../../ui/button.jsx";

const SiteWorkTypesLinkComponent = ({ siteId }) => {
    return (
        <Link to={`/site-works-type/${siteId}`}>
            <Button variant="primaryOutline" className="justify-start gap-2">
                <FiList/>
                <span className="hidden md:inline">Tâches</span>
            </Button>
        </Link>
    );
};

export default SiteWorkTypesLinkComponent;