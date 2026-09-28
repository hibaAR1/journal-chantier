import ContentLayout from "../../layouts/content/content.layout.jsx";

import WorkTypesTableLayout from "../../layouts/work-types/table/work-types-table.layout.jsx";

const WorkTypesPage = () => {
    return (
        <ContentLayout
            title="Tâches"
            permission="view work types"
        >
            {/* Add your code here */}
            <WorkTypesTableLayout />
        </ContentLayout>
    )
};

export default WorkTypesPage;
