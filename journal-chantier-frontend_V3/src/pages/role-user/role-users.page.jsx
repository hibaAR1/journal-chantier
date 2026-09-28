import ContentLayout from "../../layouts/content/content.layout.jsx";

import RoleUsersTable from "../../layouts/roles-user/table/role-users-table.layout.jsx";

const RoleUsersPage = () => {
    return (
        <ContentLayout
            title="Role des utilisateurs"
            permission="view roles"
        >
            {/* Add your code here */}
            <RoleUsersTable />
        </ContentLayout>
    )
};

export default RoleUsersPage;
