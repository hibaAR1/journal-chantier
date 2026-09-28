import {useEffect} from "react";

import {useSitesContext} from "../../../context/sites/sites.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {SitesColumnsLayout} from "../columns/sites-columns.layout.jsx";

import SitesStoreLayout from "../store/sites-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const SitesTableLayout = () => {
    const {sites, getSites, getClients, getUsers, getProjectResponsibles, getConductors} = useSitesContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Client', 'Nom', 'Adresse', 'Responsable Projet', 'Conducteur', 'Agent de Saisie', 'Magasinier', 'Emplacements', 'Travaux & Tâches', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getSites();

        await getClients();

        await getUsers();

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
                        addBtn={permissions.includes("store sites") && <SitesStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={SitesColumnsLayout()}
                        data={sites}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default SitesTableLayout;
