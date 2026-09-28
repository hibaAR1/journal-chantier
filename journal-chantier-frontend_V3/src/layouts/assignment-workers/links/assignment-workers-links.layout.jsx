import AssignmentWorkersExportLayout from "../export/assignment-workers-export.layout.jsx";
import AssignmentWorkersUploadLayout from "../upload/assignment-workers-upload.layout.jsx";

const AssignmentWorkersLinksLayout = ({assignmentId}) => {
    return (
        <div className="flex gap-2">
            <AssignmentWorkersExportLayout assignmentId={assignmentId} />

            <AssignmentWorkersUploadLayout assignmentId={assignmentId}/>
        </div>
    )
};

export default AssignmentWorkersLinksLayout;