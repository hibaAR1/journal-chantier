import ContentLayout from "../../layouts/content/content.layout.jsx";

import ResourcesTableLayout from "../../layouts/resources/table/resources-table.layout.jsx";

const ResourcesPage = () => {
    return (
        <ContentLayout
            title="Ressources"
            permission="view resources"
        >
            {/* Add your code here */}
            <ResourcesTableLayout />
        </ContentLayout>
    )
};

export default ResourcesPage;
