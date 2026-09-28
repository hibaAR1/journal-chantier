import {useState} from "react";
import {usePunchesContext} from "../../../context/punches/punches.context.jsx";
import {AlertDialogAction} from "../../../components/ui/alert-dialog.jsx";
import {Button} from "../../../components/ui/button.jsx";
import {FiXCircle, FiLoader} from "react-icons/fi";
import ValidateAlertLayout from "../../validate-alert/validate-alert.layout.jsx";
import {useReportsContext} from "../../../context/reports/reports.context.jsx";

const ReportsInvalidateLayout = ({report}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { invalidateReports } = useReportsContext();

    if (!report) return null;

    const handleClick = async () => {
        setIsLoading(true);
        await invalidateReports(report.id);
        setIsLoading(false);
    };

    return (
        <ValidateAlertLayout
            title="Dévalidation du journal"
            description={`Êtes-vous sûr de vouloir dévalider le journal "${report?.code || ""}" ?`}
            btn={
                <Button variant="dangerOutline" className="h-6 px-1">
                    <FiXCircle />
                </Button>
            }
        >
            <AlertDialogAction onClick={handleClick} className="bg-red-600 text-white hover:bg-red-500">
                {isLoading && <FiLoader className="me-2 animate-spin" />}
                Dévalider
            </AlertDialogAction>
        </ValidateAlertLayout>
    );
};

export default ReportsInvalidateLayout;
