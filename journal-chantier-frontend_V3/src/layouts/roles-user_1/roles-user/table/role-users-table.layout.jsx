import { useEffect } from "react";
import { useRolesContext } from "../../../context/role-users/role-users.context.jsx";
import { useLoadingContext } from "../../../context/loading/loading.context.jsx";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";
import { RolesColumnsLayout } from "../columns/role-users-columns.jsx";
import RolesStoreLayout from "../store/role-users-store.layout.jsx";
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import PermissionsLinkComponent from "../../../components/permissions/link/permissions-link.component.jsx";

const RolesTableLayout = () => {
    const { roles, getRoles } = useRolesContext();
    const { loading, setLoading } = useLoadingContext();
    const { user } = useAuthContext();
    const permissions = user?.permissions || [];

    const listVisibles = ['Nom', 'Abréviation', 'Actions'];

    const loadData = async () => {
        setLoading(true);
        await getRoles();
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
                    addBtn={permissions.includes("store roles") ? <RolesStoreLayout /> : ""}
                    linkBtn={permissions.includes("view permissions") ? <PermissionsLinkComponent /> : ""}
                    refreshBtn={<TableRefreshBtnComponent onClick={loadData} />}
                    columns={RolesColumnsLayout()}
                    data={roles}
                    list={listVisibles}
                    hiddenColumns={{}}
                />
            )}
        </>
    );
};

export default RolesTableLayout;
