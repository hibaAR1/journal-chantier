import {useEffect} from "react";

import {useAssignmentsContext} from "../../../context/assignments/assignments.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {AssignmentsColumnsLayout} from "../columns/assignments-columns.layout.jsx";

import AssignmentsStoreLayout from "../store/assignments-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const AssignmentsTableLayout = () => {
    const {assignments, getAssignments, getSites} = useAssignmentsContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Code', 'Chantier', 'Saisie',  'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getAssignments();

        await getSites();

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
                        addBtn={permissions.includes("store assignments") &&  <AssignmentsStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={AssignmentsColumnsLayout()}
                        data={assignments}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default AssignmentsTableLayout;
