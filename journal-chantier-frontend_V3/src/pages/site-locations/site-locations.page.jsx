import ContentLayout from "../../layouts/content/content.layout.jsx";

import {useParams} from "react-router-dom";

import SiteLocationsTableLayout from "../../layouts/site-locations/table/site-locations-table.layout.jsx";

const SiteLocationsPage = () => {
    const {siteId} = useParams();

    console.log('siteId', siteId)

    return (
        <ContentLayout
            title="Emplacements du chantier"
            permission="view site locations"
        >
            {/* Add your code here */}
            <SiteLocationsTableLayout siteId={siteId}/>
        </ContentLayout>
    )
};

export default SiteLocationsPage;
