import {useEffect} from "react";
import {useParams} from "react-router-dom";

import {useWorkTypesContext} from "../../../context/work-types/work-types.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {SiteWorkTypesColumnsLayout} from "../columns/site-work-types-columns.layout.jsx";

import SiteWorkTypesStoreLayout from "../store/site-work-types-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const SiteWorkTypesTableLayout = () => {
    const { siteId } = useParams();
    const siteIdNumber = Number(siteId);

    const {workTypes, getWorkTypes, getWorks} = useWorkTypesContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        "Travail", 'Nom','Unité','Temps unitaire réf.', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getWorkTypes(siteIdNumber);

        await getWorks(siteIdNumber);

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [siteIdNumber]);

    return (
        <>
            {
                loading
                    ? <LoadingComponent />
                    :
                    <DataTableComponent
                        addBtn={permissions.includes("store work types") && <SiteWorkTypesStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={SiteWorkTypesColumnsLayout()}
                        data={workTypes}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default SiteWorkTypesTableLayout;
