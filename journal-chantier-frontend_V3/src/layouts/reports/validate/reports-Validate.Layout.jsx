

import {useState} from "react";

import {useReportsContext} from "../../../context/reports/reports.context.jsx";

import {AlertDialogAction} from "../../../components/ui/alert-dialog.jsx";
import {Button} from "../../../components/ui/button.jsx";

import {FiCheck, FiLoader} from "react-icons/fi";
import ValidateAlertLayout from "../../validate-alert/validate-alert.layout.jsx";

const ReportsValidateLayout = ({report}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { validateReports } = useReportsContext();

    if (!report) return null;

    const handleClick = async () => {
        setIsLoading(true);
        await validateReports(report.id);
        setIsLoading(false);
    };

    return (
        <ValidateAlertLayout
            title="Validation du journal"
            description={`Êtes-vous sûr de vouloir valider le journal "${report?.code || ""}" ? Cette action est définitive.`}
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

export default ReportsValidateLayout;
