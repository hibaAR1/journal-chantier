import { useNavigate } from "react-router-dom";

import ContentLayout from "../../layouts/content/content.layout.jsx";

import PunchSummaryLayout from "../../layouts/punch-summary/summary/punch-summary.layout.jsx";

import { Button } from "../../components/ui/button.jsx";
import { FiArrowLeft } from "react-icons/fi";

/**
 * État Récapitulatif Journalier de Pointage : ouvert depuis le bouton de la page Journaux
 * (plus dans le menu de gauche). Permission "view punch summary" (Administrateur).
 */
const PunchSummaryPage = () => {
  const navigate = useNavigate();

  return (
    <ContentLayout title="État récapitulatif" permission="view punch summary">
      {/* Un seul bloc : le bouton Retour reste collé au contenu (pas de grand espace vide) */}
      <div className="w-full">
        <div className="px-4 pt-4">
          <Button
            variant="primaryOutline"
            className="justify-start gap-2"
            onClick={() => navigate("/reports")}
          >
            <FiArrowLeft />
            Retour
          </Button>
        </div>

        <PunchSummaryLayout />
      </div>
    </ContentLayout>
  );
};

export default PunchSummaryPage;
