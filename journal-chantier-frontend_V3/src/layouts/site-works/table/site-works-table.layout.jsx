import {useEffect} from "react";

import {useWorksContext} from "../../../context/works/works.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {SiteWorksColumnsLayout} from "../columns/site-works-columns.layout.jsx";

import SiteWorksStoreLayout from "../store/site-works-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import SiteWorkTypesLinkComponent from "../../../components/Site-work-types/link/Site-work-types-link.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useParams} from "react-router-dom";


const SiteWorksTableLayout = () => {
    const { siteId } = useParams();
    const siteIdNumber = Number(siteId);

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
                        addBtn={permissions.includes("store works") && <SiteWorksStoreLayout  siteId={siteIdNumber}/>}
                        linkBtn={permissions.includes("view work types") && <SiteWorkTypesLinkComponent siteId={siteIdNumber}/>}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={SiteWorksColumnsLayout(siteIdNumber)}
                        data={works}
                        list={listVisibles}
                        // hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default SiteWorksTableLayout;
