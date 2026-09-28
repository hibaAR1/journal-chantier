import {useEffect} from "react";

import {useWorksContext} from "../../../context/works/works.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {WorksColumnsLayout} from "../columns/works-columns.layout.jsx";

import WorksStoreLayout from "../store/works-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import WorkTypesLinkComponent from "../../../components/work-types/link/work-types-link.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const WorksTableLayout = () => {
    const {works, getWorks} = useWorksContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Nom',  'Actions'
    ];

    // const hiddenColumns = {"unit": false};

    const loadData = async () => {
        setLoading(true);

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
                        addBtn={permissions.includes("store works") && <WorksStoreLayout />}
                        linkBtn={permissions.includes("view work types") && <WorkTypesLinkComponent />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={WorksColumnsLayout()}
                        data={works}
                        list={listVisibles}
                        // hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default WorksTableLayout;
