import ContentLayout from "../../layouts/content/content.layout.jsx";

import SiteWorksTableLayout from "../../layouts/site-works/table/site-works-table.layout.jsx";

const SiteWorksPage = () => {
    return (
        <ContentLayout
            title="Travaux"
            permission="view works"
        >
            {/* Add your code here */}
            <SiteWorksTableLayout />
        </ContentLayout>
    )
};

export default SiteWorksPage;
