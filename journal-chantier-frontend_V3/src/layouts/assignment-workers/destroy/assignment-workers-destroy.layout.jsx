import {useState} from "react";

import {useAssignmentWorkersContext} from "../../../context/assignment-workers/assignment-workers.context.jsx";

import DestroyAlertLayout from "../../destroy-alert/destroy-alert.layout.jsx";

import {AlertDialogAction} from "../../../components/ui/alert-dialog.jsx";

import {Button} from "../../../components/ui/button.jsx";

import {FiLoader, FiTrash2} from "react-icons/fi";

const AssignmentWorkersDestroyLayout = ({assignmentWorker}) => {
    const [isLoading, setIsLoading] = useState(false);

    const {deleteAssignmentWorker} = useAssignmentWorkersContext();

    const handleClick = async () => {
        setIsLoading(true);

        await deleteAssignmentWorker(assignmentWorker);

        setIsLoading(false);
    };

    return (
        <DestroyAlertLayout
            title="Confirmer la suppression"
            description={`Êtes-vous sûr de vouloir supprimer l'affectation du "${assignmentWorker.worker_name}" ? Cette action est irréversible.`}
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

export default AssignmentWorkersDestroyLayout;
