import {useEffect} from "react";

import {useWorkTypesContext} from "../../../context/work-types/work-types.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {WorkTypesColumnsLayout} from "../columns/work-types-columns.layout.jsx";

import WorkTypesStoreLayout from "../store/work-types-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const WorkTypesTableLayout = () => {
    const {workTypes, getWorkTypes, getWorks} = useWorkTypesContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        "Travail", 'Nom','Unité','Temps unitaire réf.' ,'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getWorkTypes();

        await getWorks();

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
                        addBtn={permissions.includes("store work types") && <WorkTypesStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={WorkTypesColumnsLayout()}
                        data={workTypes}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default WorkTypesTableLayout;
