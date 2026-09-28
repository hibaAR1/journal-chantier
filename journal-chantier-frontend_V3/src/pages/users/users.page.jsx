import ContentLayout from "../../layouts/content/content.layout.jsx";

import UsersTableLayout from "../../layouts/users/table/users-table.layout.jsx";

const UsersPage = () => {
    return (
        <ContentLayout
            title="Utilisateurs"
            permission="view users"
        >
            {/* Add your code here */}
            <UsersTableLayout />
        </ContentLayout>
    )
};

export default UsersPage;