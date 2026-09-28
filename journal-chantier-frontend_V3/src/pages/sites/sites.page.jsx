import ContentLayout from "../../layouts/content/content.layout.jsx";

import SitesTableLayout from "../../layouts/sites/table/sites-table.layout.jsx";

const SitesPage = () => {
    return (
        <ContentLayout
            title="Chantiers"
            permission="view sites"
        >
            {/* Add your code here */}
            <SitesTableLayout />
        </ContentLayout>
    )
};

export default SitesPage;
