import ContentLayout from "../../layouts/content/content.layout.jsx";

import ProductCategoriesTableLayout from "../../layouts/product-categories/table/product-categories-table.layout.jsx";

const ProductCategoriesPage = () => {
    return (
        <ContentLayout
            title="Catégories d'articles"
            permission="view product categories"
        >
            {/* Add your code here */}
            <ProductCategoriesTableLayout />
        </ContentLayout>
    )
};

export default ProductCategoriesPage;
