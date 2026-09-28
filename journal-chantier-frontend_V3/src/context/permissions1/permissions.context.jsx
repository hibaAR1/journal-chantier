import { createContext, useContext, useState } from "react";

import PermissionsApis from "../../apis/permissions.apis.jsx";
import { useToast } from "../../hooks/use-toast.js";

const PermissionsContext = createContext({
    permissions: [],
    getPermissions: () => {},
    addPermission: () => {},
    updatePermission: () => {},
    deletePermission: () => {},
});

export const PermissionsProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);
    const { toast } = useToast();

    const getPermissions = async () => {
        try {
            const { data } = await PermissionsApis.getPermissions();
            setPermissions(Array.isArray(data) ? data : data.permissions || []);
        } catch (error) {
            console.warn("GET PERMISSIONS ERROR:", error?.response?.data || error);
        }
    };

    const addPermission = async (values, form) => {
        const { setError, reset } = form;
        try {
            const response = await PermissionsApis.create(values);
            if (response.status === 201) {
                setPermissions([...permissions, response.data.permission]);
                toast({
                    variant: "success",
                    title: "Ajout réussi",
                    description: `La permission "${response.data.permission.name}" a été ajoutée avec succès.`,
                });
                reset();
            }
        } catch ({ response }) {
            if (response?.data?.errors?.name) {
                setError("name", {
                    message: response.data.errors.name.join(),
                });
            }
            // Gérer d'autres erreurs selon besoin
        }
    };

    const updatePermission = async (id, values, form) => {
        const { setError, reset } = form;
        try {
            const response = await PermissionsApis.update(id, values);
            if (response.status === 200) {
                setPermissions(
                    permissions.map((perm) =>
                        perm.id !== id ? perm : response.data.permission
                    )
                );
                toast({
                    variant: "warning",
                    title: "Modification réussie",
                    description: `La permission "${response.data.permission.name}" a été modifiée avec succès.`,
                });
                reset();
            }
        } catch ({ response }) {
            if (response?.data?.errors?.name) {
                setError("name", {
                    message: response.data.errors.name.join(),
                });
            }
        }
    };

    const deletePermission = async (permission) => {
        try {
            const response = await PermissionsApis.delete(permission.id);
            if (response.status === 200) {
                setPermissions(permissions.filter((p) => p.id !== permission.id));
                toast({
                    variant: "danger",
                    title: "Suppression réussie",
                    description: `La permission "${permission.name}" a été supprimée avec succès.`,
                });
            }
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <PermissionsContext.Provider
            value={{
                permissions,
                getPermissions,
                addPermission,
                updatePermission,
                deletePermission,
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissionsContext = () => useContext(PermissionsContext);
