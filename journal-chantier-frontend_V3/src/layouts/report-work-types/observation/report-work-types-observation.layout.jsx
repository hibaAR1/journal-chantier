import {Button} from "../../../components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../../../components/ui/alert-dialog.jsx";

const ReportWorkTypesObservationLayout = ({value, title, children}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="infoOutline" className="h-6 px-1">
                    {children}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-primary-600">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-black">
                        {value}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default ReportWorkTypesObservationLayout;
