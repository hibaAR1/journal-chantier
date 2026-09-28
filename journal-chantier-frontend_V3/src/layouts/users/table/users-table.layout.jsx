// src/pages/users/table/users-table.layout.jsx
import { useEffect } from "react";

import { useUsersContext } from "../../../context/users/users.context.jsx";
import { useLoadingContext } from "../../../context/loading/loading.context.jsx";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import UsersStoreLayout from "../store/users-store.layout.jsx";
import UsersColumnsLayout from "../columns/users-columns.layout.jsx";
import RolesLinkComponent from "../../../components/user-roles/link/users-role-link.component.jsx";
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

const UsersTableLayout = () => {
    const { users, getUsers } = useUsersContext();
    const { loading, setLoading } = useLoadingContext();
    const { user } = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = ["Nom", "Email", "Job", "Username", "N° d'enregistrement", "Actions"];
    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);
        await getUsers();
        setLoading(false);
    }

    console.log("Valeur du context users:", users);

    useEffect(() => {
        console.log(" useEffect déclenché");
        loadData();
    }, []);
    console.log("Users data:", users);

    return (
        <>
            {
                loading
                    ? <LoadingComponent />
                    : <DataTableComponent
                        addBtn={permissions.includes("store users") ? <UsersStoreLayout /> : ""}
                        linkBtn={permissions.includes("view roles") ? <RolesLinkComponent /> : ""}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData} />}
                        columns={UsersColumnsLayout()}
                        data={users}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
};

export default UsersTableLayout;
