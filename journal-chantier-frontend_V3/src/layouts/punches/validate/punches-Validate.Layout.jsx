// pages/punches/validate/punches-validate.layout.jsx

import {useState} from "react";

import {usePunchesContext} from "../../../context/punches/punches.context.jsx";
import DestroyAlertLayout from "../../destroy-alert/destroy-alert.layout.jsx";

import {AlertDialogAction} from "../../../components/ui/alert-dialog.jsx";
import {Button} from "../../../components/ui/button.jsx";

import {FiCheck, FiLoader} from "react-icons/fi";
import ValidateAlertLayout from "../../validate-alert/validate-alert.layout.jsx";

const PunchesValidateLayout = ({punch}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { validatePunches } = usePunchesContext();

    if (!punch) return null;

    const handleClick = async () => {
        setIsLoading(true);
        await validatePunches(punch.id);
        setIsLoading(false);
    };

    return (
        <ValidateAlertLayout
            title="Validation du pointage"
            description={`Êtes-vous sûr de vouloir valider le pointage "${punch?.code || ""}" ? Cette action est définitive.`}
            btn={
                <Button variant="successOutline" className="h-6 px-1">
                    <FiCheck />
                </Button>
            }
        >
            <AlertDialogAction onClick={handleClick} className="bg-green-600 text-white hover:bg-green-500">
                {isLoading && <FiLoader className="me-2 animate-spin" />}
                Valider
            </AlertDialogAction>
        </ValidateAlertLayout>
    );
};

export default PunchesValidateLayout;
