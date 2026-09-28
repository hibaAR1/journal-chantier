import ContentLayout from "../../layouts/content/content.layout.jsx";

import WorkersTableLayout from "../../layouts/workers/table/workers-table.layout.jsx";

const WorkersPage = () => {
    return (
        <ContentLayout
            title="Ouvriers"
            permission="view workers"
        >
            {/* Add your code here */}
            <WorkersTableLayout />
        </ContentLayout>
    )
};

export default WorkersPage;
