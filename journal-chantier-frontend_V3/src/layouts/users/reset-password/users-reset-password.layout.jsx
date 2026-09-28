import { useState } from "react";
import { useUsersContext } from "../../../context/users/users.context.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { FiKey, FiLoader, FiX } from "react-icons/fi";

const UsersResetPasswordLayout = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState(null); // stocke le mot de passe généré
    const { resetUserPassword } = useUsersContext();

    const handleReset = async () => {
        setIsLoading(true);
        const password = await resetUserPassword(user);
        setIsLoading(false);

        if (password) {
            setNewPassword(password); // ouvre le modal
        }
    };

    const closeModal = () => setNewPassword(null);

    return (
        <>
            <Button
                onClick={handleReset}
                disabled={isLoading}
                variant="secondaryOutline"
                className="h-6 px-1"
                title="Réinitialiser mot de passe"
            >
                {isLoading ? <FiLoader className="animate-spin" /> : <FiKey />}
            </Button>

            {/* Modal */}
            {newPassword && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            <FiX size={20} />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Mot de passe réinitialisé</h3>
                        <p className="mb-4">
                            Nouveau mot de passe pour <span className="font-semibold">{user.name}</span> :
                        </p>
                        <div className="bg-gray-100 px-4 py-2 rounded text-center font-mono text-lg mb-4 select-all">
                            {newPassword}
                        </div>
                        <Button onClick={closeModal} className="w-full">
                            Fermer
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsersResetPasswordLayout;