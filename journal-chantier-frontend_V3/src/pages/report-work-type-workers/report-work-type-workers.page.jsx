import ContentLayout from "../../layouts/content/content.layout.jsx";

import {useParams} from "react-router-dom";

import ReportWorkTypeWorkersTableLayout
    from "../../layouts/report-work-type-workers/table/report-work-type-workers-table.layout.jsx";

const ReportWorkTypeWorkersPage = () => {
    const {reportWorkTypeId} = useParams();

    return (
        <ContentLayout
            title="Journaux"
            permission="view report work type workers"
        >
            {/* Add your code here */}
            <ReportWorkTypeWorkersTableLayout reportWorkTypeId={reportWorkTypeId}/>
        </ContentLayout>
    )
};

export default ReportWorkTypeWorkersPage;
