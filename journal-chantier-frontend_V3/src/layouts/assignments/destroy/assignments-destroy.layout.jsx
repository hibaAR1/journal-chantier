import {useState} from "react";

import {useAssignmentsContext} from "../../../context/assignments/assignments.context.jsx";

import DestroyAlertLayout from "../../destroy-alert/destroy-alert.layout.jsx";

import {AlertDialogAction} from "../../../components/ui/alert-dialog.jsx";

import {Button} from "../../../components/ui/button.jsx";

import {FiLoader, FiTrash2} from "react-icons/fi";

const AssignmentsDestroyLayout = ({assignment}) => {
    const [isLoading, setIsLoading] = useState(false);

    const {deleteAssignment} = useAssignmentsContext();

    const handleClick = async () => {
        setIsLoading(true);

        await deleteAssignment(assignment);

        setIsLoading(false);
    };

    return (
        <DestroyAlertLayout
            title="Confirmer la suppression"
            description={`Êtes-vous sûr de vouloir supprimer le dossier d'affectation "${assignment.code}" ? Cette action est irréversible.`}
            btn={
                <Button variant="dangerOutline" className="h-6 px-1">
                    <FiTrash2 />
                </Button>
            }
        >
            <AlertDialogAction onClick={handleClick} className="bg-primary-600 text-white hover:bg-primary-500">
                {isLoading && <FiLoader className="me-2 animate-spin"/>}
                Continuer
            </AlertDialogAction>
        </DestroyAlertLayout>
    )
}

export default AssignmentsDestroyLayout;
