import {useEffect} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useLocationsContext} from "../../../context/locations/locations.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {LocationsColumnsLayout} from "../columns/locations-columns.layout.jsx";

import LocationsStoreLayout from "../store/locations-store.layout.jsx";
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const LocationsTableLayout = () => {
    const {locations, getLocations} = useLocationsContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Nom', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getLocations();

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
                        addBtn={permissions.includes("store locations") && <LocationsStoreLayout/>}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={LocationsColumnsLayout()}
                        data={locations}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default LocationsTableLayout;
