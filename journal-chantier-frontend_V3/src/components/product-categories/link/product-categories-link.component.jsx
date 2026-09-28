import {Link} from "react-router-dom";

import {FiList} from "react-icons/fi";
import {Button} from "../../ui/button.jsx";

const ProductCategoriesLinkComponent = () => {
    return (
        <Link to="/product-categories">
            <Button variant="primaryOutline" className="justify-start gap-2">
                <FiList/>
                <span className="hidden md:inline">Catégories</span>
            </Button>
        </Link>
    );
};

export default ProductCategoriesLinkComponent;