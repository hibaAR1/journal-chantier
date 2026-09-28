import {useParams} from "react-router-dom";

import ContentLayout from "../../layouts/content/content.layout.jsx";

import AssignmentWorkersTableLayout from "../../layouts/assignment-workers/table/assignment-workers-table.layout.jsx";

const AssignmentWorkersPage = () => {
    const {assignmentId} = useParams();

    return (
        <ContentLayout
            title="Affectations"
            permission="view assignments"
        >
            {/* Add your code here */}
            <AssignmentWorkersTableLayout assignmentId={assignmentId} />
        </ContentLayout>
    )
};

export default AssignmentWorkersPage;
