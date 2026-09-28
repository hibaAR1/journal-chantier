import ContentLayout from "../../layouts/content/content.layout.jsx";

import LocationsTableLayout from "../../layouts/locations/table/locations-table.layout.jsx";

const LocationsPage = () => {
    return (
        <ContentLayout
            title="Emplacements"
            permission="view locations"
        >
            {/* Add your code here */}
            <LocationsTableLayout />
        </ContentLayout>
    )
};

export default LocationsPage;
