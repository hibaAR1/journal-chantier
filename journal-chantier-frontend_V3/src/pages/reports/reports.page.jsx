import ContentLayout from "../../layouts/content/content.layout.jsx";

import ReportsTableLayout from "../../layouts/reports/table/reports-table.layout.jsx";

const ReportsPage = () => {
    return (
        <ContentLayout
            title="Journaux"
            permission="view reports"
        >
            {/* Add your code here */}
            <ReportsTableLayout />
        </ContentLayout>
    )
};

export default ReportsPage;
