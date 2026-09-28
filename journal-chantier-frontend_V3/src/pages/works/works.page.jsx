import ContentLayout from "../../layouts/content/content.layout.jsx";

import WorksTableLayout from "../../layouts/works/table/works-table.layout.jsx";

const WorksPage = () => {
    return (
        <ContentLayout
            title="Travaux"
            permission="view works"
        >
            {/* Add your code here */}
            <WorksTableLayout />
        </ContentLayout>
    )
};

export default WorksPage;
