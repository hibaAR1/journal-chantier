import ContentLayout from "../../layouts/content/content.layout.jsx";

import {useParams} from "react-router-dom";

import ReportWorkTypesTableLayout from "../../layouts/report-work-types/table/report-work-types-table.layout.jsx";

const ReportWorkTypesPage = () => {
    const {reportId} = useParams();

    return (
        <ContentLayout
            title="Journaux"
            permission="view report work types"
        >
            {/* Add your code here */}
            <ReportWorkTypesTableLayout reportId={reportId}/>
        </ContentLayout>
    )
};

export default ReportWorkTypesPage;
