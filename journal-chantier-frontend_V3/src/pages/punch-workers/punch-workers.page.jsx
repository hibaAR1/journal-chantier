import {useParams} from "react-router-dom";

import ContentLayout from "../../layouts/content/content.layout.jsx";

import PunchWorkersTableLayout from "../../layouts/punch-workers/table/punch-workers-table.layout.jsx";

const PunchWorkersPage = () => {
    const {punchId} = useParams();

    return (
        <ContentLayout
            title="Pointages"
            permission="view punches"
        >
            {/* Add your code here */}
            <PunchWorkersTableLayout punchId={punchId} />
        </ContentLayout>
    )
};

export default PunchWorkersPage;
