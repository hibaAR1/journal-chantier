import ContentLayout from "../../layouts/content/content.layout.jsx";

import MovementsTableLayout from "../../layouts/movements/table/movements-table.layout.jsx";

const MovementsPage = () => {
    return (
        <ContentLayout
            title="Mouvements"
            permission="view movements"
        >
            {/* Add your code here */}
            <MovementsTableLayout />
        </ContentLayout>
    )
};

export default MovementsPage;
