import {useEffect} from "react";

import {useResourcesContext} from "../../../context/resources/resources.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {ResourcesColumnsLayout} from "../columns/resources-columns.layout.jsx";

import ResourcesStoreLayout from "../store/resources-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const ResourcesTableLayout = () => {
    const {resources, getResources} = useResourcesContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Code', 'Nom','Abréviation' , 'Type', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

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
                        addBtn={permissions.includes("store resources") && <ResourcesStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={ResourcesColumnsLayout()}
                        data={resources}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default ResourcesTableLayout;
