import ContentLayout from "../../layouts/content/content.layout.jsx";

import PunchSummaryLayout from "../../layouts/punch-summary/summary/punch-summary.layout.jsx";

const PunchSummaryPage = () => {
  return (
    <ContentLayout title="État récapitulatif" permission="view punches">
      <PunchSummaryLayout />
    </ContentLayout>
  );
};

export default PunchSummaryPage;
