import { useState } from "react";

import { useWorkersContext } from "../../../context/workers/workers.context.jsx";

import { Button } from "../../../components/ui/button.jsx";
import { FiCheckCircle, FiSlash, FiLoader } from "react-icons/fi";

/**
 * Bouton ACTIF / INACTIF d'un ouvrier, à côté du crayon (CDC V3 § 3.3).
 * Visible seulement pour les profils RH (permission "manage worker status").
 *  - ouvrier ACTIF   : bouton orange ⊘ « Désactiver »
 *  - ouvrier INACTIF : bouton vert ✓ « Activer »
 */
const WorkersToggleStatusLayout = ({ worker }) => {
  const { toggleWorkerStatus } = useWorkersContext();

  const [isLoading, setIsLoading] = useState(false);

  const isActive = worker.is_active !== false;

  const handleToggle = async () => {
    setIsLoading(true);

    await toggleWorkerStatus(worker);

    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={isActive ? "warningOutline" : "successOutline"}
      className="h-6 px-1"
      title={isActive ? "Passer en INACTIF" : "Passer en ACTIF"}
    >
      {isLoading ? (
        <FiLoader className="animate-spin" />
      ) : isActive ? (
        <FiSlash />
      ) : (
        <FiCheckCircle />
      )}
    </Button>
  );
};

export default WorkersToggleStatusLayout;
