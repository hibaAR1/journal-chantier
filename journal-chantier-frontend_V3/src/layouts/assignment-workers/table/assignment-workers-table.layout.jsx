import {useEffect} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useAssignmentWorkersContext} from "../../../context/assignment-workers/assignment-workers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {AssignmentWorkersColumnsLayout} from "../columns/assignment-workers-columns.layout.jsx";

import AssignmentWorkersStoreLayout from "../store/assignment-workers-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

import AssignmentWorkersLinksLayout from "../links/assignment-workers-links.layout.jsx";

const AssignmentWorkersTableLayout = ({assignmentId}) => {
    const {assignmentWorkers, assignment, getAssignmentWorkers, getWorkers, getAssignment} = useAssignmentWorkersContext();

    const {loading, setLoading, setExportLoading, setImportLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Ouvrier', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        setExportLoading(false);

        setImportLoading(false);

        await getAssignmentWorkers(assignmentId);

        await getAssignment(assignmentId);

        await getWorkers();

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
                    <div className="w-full">
                        <h2 className="pt-2 px-4 font-bold">
                            {assignment.site_name}
                        </h2>
                        <DataTableComponent
                            addBtn={permissions.includes("store assignments") &&  <AssignmentWorkersStoreLayout assignmentId={assignmentId}/>}
                            refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                            linkBtn={<AssignmentWorkersLinksLayout assignmentId={assignmentId} />}
                            columns={AssignmentWorkersColumnsLayout()}
                            data={assignmentWorkers}
                            list={listVisibles}
                            hiddenColumns={hiddenColumns}
                        />
                    </div>
            }
        </>
    )
}

export default AssignmentWorkersTableLayout;
