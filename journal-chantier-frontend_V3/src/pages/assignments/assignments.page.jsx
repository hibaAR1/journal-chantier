import ContentLayout from "../../layouts/content/content.layout.jsx";

import AssignmentsTableLayout from "../../layouts/assignments/table/assignments-table.layout.jsx";

const AssignmentsPage = () => {
    return (
        <ContentLayout
            title="Dossiers affectations"
            permission="view assignments"
        >
            {/* Add your code here */}
            <AssignmentsTableLayout />
        </ContentLayout>
    )
};

export default AssignmentsPage;
