import {useEffect} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useClientsContext} from "../../../context/clients/clients.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {ClientsColumnsLayout} from "../columns/clients-columns.layout.jsx";

import ClientsStoreLayout from "../store/clients-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const ClientsTableLayout = () => {
    const {clients, getClients} = useClientsContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Code Système', 'Raison Social', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getClients();

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
                        addBtn={permissions.includes("store clients") ? <ClientsStoreLayout /> : ""}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={ClientsColumnsLayout()}
                        data={clients}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default ClientsTableLayout;
