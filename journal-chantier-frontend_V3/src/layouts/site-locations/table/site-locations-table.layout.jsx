import PropTypes from 'prop-types';
import {useEffect} from "react";

import {useSiteLocationsContext} from "../../../context/site-locations/site-locations.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {SiteLocationsColumnsLayout} from "../columns/site-locations-columns.layout.jsx";

import SiteLocationsStoreLayout from "../store/site-locations-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const SiteLocationsTableLayout = ({siteId}) => {
    const {site, siteLocations, getSite, getSiteLocations, getLocations} = useSiteLocationsContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Emplacement',
        'Bloc',
        'Element',
        'Actions'
    ];

    const hiddenColumns = {
    };

    const loadData = async () => {
        setLoading(true);

        await getSite(siteId);

        await getSiteLocations(siteId);

        await getLocations();

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        console.log('soye', site, siteId);
    }, [site]);

    return (
        <>
            {
                loading
                    ? <LoadingComponent />
                    :
                    <div className="w-full">
                        <h2 className="pt-2 px-4 font-bold">
                            {site.name}
                        </h2>

                        <DataTableComponent
                            addBtn={permissions.includes("store site locations") && <SiteLocationsStoreLayout siteId={siteId}/>}
                            refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                            columns={SiteLocationsColumnsLayout()}
                            data={siteLocations}
                            list={listVisibles}
                            hiddenColumns={hiddenColumns}
                        />
                    </div>
            }
        </>
    )
}

SiteLocationsTableLayout.propTypes = {
    siteId: PropTypes.string.isRequired,
};

export default SiteLocationsTableLayout;