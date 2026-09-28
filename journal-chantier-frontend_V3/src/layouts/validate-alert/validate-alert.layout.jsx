import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "../../components/ui/alert-dialog.jsx";

const ValidateAlertLayout = ({btn, title, description, children}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {btn}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-primary-600">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-black">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    {children}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default ValidateAlertLayout;
