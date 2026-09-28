import {useEffect} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useSuppliersContext} from "../../../context/suppliers/suppliers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {SuppliersColumnsLayout} from "../columns/suppliers-columns.layout.jsx";

import SuppliersStoreLayout from "../store/suppliers-store.layout.jsx"

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const SuppliersTableLayout = () => {
    const {suppliers, getSuppliers} = useSuppliersContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Code Système', 'Raison Social', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getSuppliers();

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
                        addBtn={permissions.includes("store suppliers") ? <SuppliersStoreLayout /> : ""}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={SuppliersColumnsLayout()}
                        data={suppliers}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default SuppliersTableLayout;
