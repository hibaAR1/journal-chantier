// src/layouts/users/destroy/users-destroy.layout.jsx
import { useState } from "react";

import { useUsersContext } from "../../../context/users/users.context.jsx";
import DestroyAlertLayout from "../../destroy-alert/destroy-alert.layout.jsx";

import { AlertDialogAction } from "../../../components/ui/alert-dialog.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { FiTrash2, FiLoader } from "react-icons/fi";

const UsersDestroyLayout = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { deleteUser } = useUsersContext();

    const handleClick = async () => {
        setIsLoading(true);
        await deleteUser(user);
        setIsLoading(false);
    };

    return (
        <DestroyAlertLayout
            title="Confirmer la suppression"
            description={`Voulez-vous vraiment supprimer l'utilisateur \"${user.name}\" ? Cette action est irréversible.`}
            btn={
                <Button variant="dangerOutline" className="h-6 px-1">
                    <FiTrash2 />
                </Button>
            }
        >
            <AlertDialogAction onClick={handleClick} className="bg-red-600 text-white hover:bg-red-500">
                {isLoading && <FiLoader className="me-2 animate-spin" />}
                Supprimer
            </AlertDialogAction>
        </DestroyAlertLayout>
    );
};

export default UsersDestroyLayout;
