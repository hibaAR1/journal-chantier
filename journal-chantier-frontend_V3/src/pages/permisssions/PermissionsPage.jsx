import ContentLayout from "../../layouts/content/content.layout.jsx";

import PermissionsTable from "../../layouts/permissions/table/permissions-table.layout.jsx";

const PermissionsPage = () => {
    return (
        <ContentLayout
            title="Gestion des permissions"
            permission="view permissions"  // Permission requise pour accéder à cette page
        >
            <PermissionsTable />
        </ContentLayout>
    );
};

export default PermissionsPage;
