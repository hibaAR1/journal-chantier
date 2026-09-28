import {useEffect} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useProductsContext} from "../../../context/products/products.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {ProductsColumnsLayout} from "../columns/products-columns.layout.jsx";

import ProductsStoreLayout from "../store/products-store.layout.jsx";

import ProductCategoriesLinkComponent from "../../../components/product-categories/link/product-categories-link.component.jsx";
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const ProductsTableLayout = () => {
    const {products, getProducts, getProductCategories} = useProductsContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        "Catégorie d'article", 'Nom', 'Unité', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getProducts();

        await getProductCategories();

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {
                loading
                    ? <LoadingComponent />
                    :
                    <DataTableComponent
                        addBtn={permissions.includes("store products") ? <ProductsStoreLayout /> : ""}
                        linkBtn={permissions.includes("view product categories") ? <ProductCategoriesLinkComponent /> : ""}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={ProductsColumnsLayout()}
                        data={products}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default ProductsTableLayout;
