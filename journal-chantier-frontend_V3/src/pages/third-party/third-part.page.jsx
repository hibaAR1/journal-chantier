import ContentLayout from "../../layouts/content/content.layout.jsx";

import TabContentLayout from "../../layouts/tab-content/tab-content.layout.jsx";

import ClientsTableLayout from "../../layouts/clients/table/clients-table.layout.jsx";
import SuppliersTableLayout from "../../layouts/suppliers/table/suppliers-table.layout.jsx";

const ThirdPartyPage = () => {
    return (
        <ContentLayout
            title="Tiers"
            permission="view third parties"
            type="tabs"
            tabs={[
                {title: 'clients', value: "Clients"},
                {title: 'suppliers', value: "Fournisseurs"}
            ]}
            defaultTab="clients"
        >
            <TabContentLayout value="clients">
                <ClientsTableLayout />
            </TabContentLayout>
            <TabContentLayout value="suppliers">
                <SuppliersTableLayout />
            </TabContentLayout>
        </ContentLayout>
    )
};

export default ThirdPartyPage;
