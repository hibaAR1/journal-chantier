import ContentLayout from "../../layouts/content/content.layout.jsx";

import PunchesTableLayout from "../../layouts/punches/table/punches-table.layout.jsx";

const PunchesPage = () => {
    return (
        <ContentLayout
            title="Dossiers pointages"
            permission="view punches"
        >
            {/* Add your code here */}
            <PunchesTableLayout />
        </ContentLayout>
    )
};

export default PunchesPage;
