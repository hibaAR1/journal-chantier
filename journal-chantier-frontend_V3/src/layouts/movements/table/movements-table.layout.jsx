import {useEffect} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useMovementsContext} from "../../../context/movements/movements.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {MovementsColumnsLayout} from "../columns/movements-columns.layout.jsx";

import MovementsStoreLayout from "../store/movements-store.layout.jsx";
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const MovementsTableLayout = () => {
    const {movements, getMovements, getSites, getSuppliers, getProducts} = useMovementsContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Code', 'Chantier', 'Article', 'Fournisseur', 'Type', 'Date', 'Quantité', 'Num BL', 'Num Réception', 'Num Sortie', 'Actions'
    ];

    const hiddenColumns = {
        'delivery_num': false,
        'receipt_num': false,
        'exit_num': false,
    };

    const loadData = async () => {
        setLoading(true);

        await getMovements();

        await getSites();

        await getProducts();

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
                        addBtn={permissions.includes("store movements") &&  <MovementsStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={MovementsColumnsLayout()}
                        data={movements}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default MovementsTableLayout;
