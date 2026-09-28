import ContentLayout from "../../layouts/content/content.layout.jsx";

import ProductsTableLayout from "../../layouts/products/table/products-table.layout.jsx";

const ProductsPage = () => {
    return (
        <ContentLayout
            title="Articles"
            permission="view products"
        >
            {/* Add your code here */}
            <ProductsTableLayout />
        </ContentLayout>
    )
};

export default ProductsPage;
