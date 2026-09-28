import { useState, useEffect } from "react";
import { useUsersContext } from "../../../context/users/users.context.jsx";

import { Button } from "../../../components/ui/button.jsx";
import { FiCheckCircle, FiSlash, FiLoader } from "react-icons/fi";

const UsersToggleStatusLayout = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [active, setActive] = useState(user.is_active); // ← statut local
    const { toggleUserStatus } = useUsersContext();

    // Met à jour le statut local si `user` change depuis le contexte
    useEffect(() => {
        setActive(user.is_active);
    }, [user.is_active]);

    const handleToggle = async () => {
        setIsLoading(true);
        const updatedUser = await toggleUserStatus(user);
        setActive(updatedUser?.is_active ?? active); // ← mettre à jour l’icône et le bouton
        setIsLoading(false);
    };

    return (
        <Button
            onClick={handleToggle}
            variant={active ? "warningOutline" : "successOutline"}
            className="h-6 px-1"
        >
            {isLoading
                ? <FiLoader className="animate-spin" />
                : active
                    ? <FiSlash title="Désactiver" />
                    : <FiCheckCircle title="Activer" />
            }
        </Button>
    );
};

export default UsersToggleStatusLayout;
