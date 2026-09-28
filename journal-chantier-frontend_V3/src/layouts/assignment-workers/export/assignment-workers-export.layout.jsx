import {useAssignmentWorkersContext} from "../../../context/assignment-workers/assignment-workers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import {Button} from "../../../components/ui/button.jsx";

import {FiDownload, FiLoader} from "react-icons/fi";

const AssignmentWorkersExportLayout = ({assignmentId}) => {
    const {exportAssignmentWorkers} = useAssignmentWorkersContext();

    const {exportLoading} = useLoadingContext();

    const handleExportClick = async () => {
        await exportAssignmentWorkers(assignmentId);
    }

    return (
        <Button
            variant="primaryOutline"
            className="justify-start gap-2 m-0"
            onClick={handleExportClick}
        >
            {
                exportLoading
                    ? <FiLoader className="me-2 animate-spin"/>
                    : <FiDownload/>
            }

            <span className="hidden md:inline">Télécharger</span>
        </Button>
    )
};

export default AssignmentWorkersExportLayout;