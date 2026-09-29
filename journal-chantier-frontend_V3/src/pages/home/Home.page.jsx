import ContentLayout from "../../layouts/content/content.layout.jsx";

import DashboardTabsLayout from "../../layouts/dashboard/tabs/dashboard-tabs.layout.jsx";

const HomePage = () => {
  return (
    <ContentLayout title="Tableau de bord" permission="view dashboard">
      <DashboardTabsLayout />
    </ContentLayout>
  );
};

export default HomePage;
