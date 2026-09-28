import {useEffect} from "react";

import {useWorkersContext} from "../../../context/workers/workers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {WorkersColumnsLayout} from "../columns/workers-columns.layout.jsx";

import WorkersStoreLayout from "../store/workers-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import WorkersLinksLayout from "../links/workers-links.layout.jsx";

const WorkersTableLayout = () => {
    const {workers, getWorkers, getResources} = useWorkersContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Matricule', 'Nom', 'Callification', 'Type de contrat', 'Actions'
    ];


    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getWorkers();

        await getResources();

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
                        addBtn={permissions.includes("store workers") && <WorkersStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData} />}
                        linkBtn={<WorkersLinksLayout />}
                        columns={WorkersColumnsLayout()}
                        data={workers}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default WorkersTableLayout;
