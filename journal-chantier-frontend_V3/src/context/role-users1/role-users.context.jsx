import { createContext, useContext, useState } from "react";

import RolesApis from "../../apis/roles.apis.jsx";
import { useToast } from "../../hooks/use-toast.js";
import {getAccessToken} from "../../utilities/access-token.js";

const RolesContext = createContext({
    roles: [],
    getRoles: () => {},
    addRole: () => {},
    updateRole: () => {},
    deleteRole: () => {},
});

export const RolesProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const { toast } = useToast();

    const getRoles = async () => {
        try {
            const { data } = await RolesApis.getRoles();
            setRoles(Array.isArray(data) ? data : data.roles || []);
        } catch (error) {
            console.warn("GET ROLES ERROR:", error?.response?.data || error);
        }
    };



    const addRole = async (values, form) => {
        const { setError, reset } = form;

        try {
            const response = await RolesApis.create(values);
            if (response.status === 201) {
                setRoles([...roles, response.data.role]);

                toast({
                    variant: "success",
                    title: "Ajout réussi",
                    description: `Le rôle "${response.data.role.name}" a été ajouté avec succès.`,
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

    const updateRole = async (id, values, form) => {
        const { setError, reset } = form;

        try {
            const response = await RolesApis.update(id, values);
            if (response.status === 200) {
                setRoles(
                    roles.map((role) =>
                        role.id !== id ? role : response.data.role
                    )
                );

                toast({
                    variant: "warning",
                    title: "Modification réussie",
                    description: `Le rôle "${response.data.role.name}" a été modifié avec succès.`,
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

    const deleteRole = async (role) => {
        try {
            const response = await RolesApis.delete(role.id);
            if (response.status === 200) {
                setRoles(roles.filter((r) => r.id !== role.id));

                toast({
                    variant: "danger",
                    title: "Suppression réussie",
                    description: `Le rôle "${role.name}" a été supprimé avec succès.`,
                });
            }
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <RolesContext.Provider
            value={{
                roles,
                getRoles,
                addRole,
                updateRole,
                deleteRole,
            }}
        >
            {children}
        </RolesContext.Provider>
    );
};

export const useRolesContext = () => useContext(RolesContext);
