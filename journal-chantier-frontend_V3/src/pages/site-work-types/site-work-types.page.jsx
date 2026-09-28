import ContentLayout from "../../layouts/content/content.layout.jsx";

import SiteWorkTypesTableLayout from "../../layouts/site-work-types/table/site-work-types-table.layout.jsx";
import { useParams } from "react-router-dom";

const SiteWorkTypesPage = () => {
    const { siteId } = useParams();
    const siteIdNumber = Number(siteId);

    return (
        <ContentLayout
            title="Tâches"
            permission="view work types"
        >
            {/* Add your code here */}
            <SiteWorkTypesTableLayout siteId={siteIdNumber}/>
        </ContentLayout>
    )
};

export default SiteWorkTypesPage;
