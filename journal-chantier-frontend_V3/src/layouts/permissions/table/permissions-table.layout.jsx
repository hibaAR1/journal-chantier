import { useEffect } from "react";

import { usePermissionsContext } from "../../../context/permissions/permissions.context.jsx"; // correction ici
import { useLoadingContext } from "../../../context/loading/loading.context.jsx";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import { PermissionsColumnsLayout } from "../columns/permissions-columns.jsx";
import PermissionsStoreLayout from "../store/permissions-store.layout.jsx"; // correction nom fichier
import PermissionsLinkComponent from "../../../components/permissions/link/permissions-link.component.jsx"; // à créer
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const PermissionsTableLayout = () => {
    const { permissions, getPermissions } = usePermissionsContext(); // permissions = liste des permissions du contexte
    const { loading, setLoading } = useLoadingContext();
    const { user } = useAuthContext();

    // Permissions de l'utilisateur connecté, pour contrôle d'accès UI
    const userPermissions = user?.permissions || [];

    const listVisibles = ['Nom', 'Abréviation', 'Actions'];

    const loadData = async () => {
        setLoading(true);
        await getPermissions(); // Correct ici
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {loading ? (
                <LoadingComponent />
            ) : (
                <DataTableComponent
                    addBtn={userPermissions.includes("store permissions") ? <PermissionsStoreLayout /> : ""}
                    refreshBtn={<TableRefreshBtnComponent onClick={loadData} />}
                    columns={PermissionsColumnsLayout()}
                    data={permissions}
                    list={listVisibles}
                    hiddenColumns={{}}
                />
            )}
        </>
    );
};

export default PermissionsTableLayout;
