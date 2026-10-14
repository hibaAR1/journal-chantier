import { useNavigate } from "react-router-dom";

import { Button } from "../../../components/ui/button.jsx";
import { FiFileText } from "react-icons/fi";

/**
 * Bouton « État récapitulatif » de la page Journaux (à côté de Rafraîchir).
 * Ouvre la page de l'État Récapitulatif Journalier de Pointage (CDC V3 § 3.1.6).
 * Visible seulement avec la permission "view punch summary" (Administrateur).
 */
const ReportsPunchSummaryLinkLayout = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="primaryOutline"
      className="justify-start gap-2"
      onClick={() => navigate("/punch-summary")}
    >
      <FiFileText />
      État récapitulatif
    </Button>
  );
};

export default ReportsPunchSummaryLinkLayout;
