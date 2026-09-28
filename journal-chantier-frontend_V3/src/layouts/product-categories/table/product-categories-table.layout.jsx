import {useEffect} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useProductCategoriesContext} from "../../../context/product-categories/product-categories.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {ProductCategoriesColumnsLayout} from "../columns/product-categories-columns.layout.jsx";

import ProductCategoriesStoreLayout from "../store/product-categories-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const ProductCategoriesTableLayout = () => {
    const {productCategories, getProductCategories} = useProductCategoriesContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Nom', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

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
                        addBtn={permissions.includes("store product categories") ? <ProductCategoriesStoreLayout /> : ""}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={ProductCategoriesColumnsLayout()}
                        data={productCategories}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default ProductCategoriesTableLayout;
