import {createContext, useContext, useState} from "react";

import UsersApis from "../../apis/users.apis.jsx";
import {toast} from "../../hooks/use-toast.js";

const UsersContext = createContext({
    users: [],
    getUsers: () => {},
    filterUsers: () => {},
    addUser: () => {},
    updateUser: () => {},
    toggleUserStatus: () => {},
    resetUserPassword: () => {},
});

export const UsersProvider = ({children}) => {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        console.log("getUsers() called");
        await UsersApis.getUsers()
            .then(({data}) => {
                console.log("Utilisateurs reçus :", data);
                setUsers(data);
            })
            .catch(error => {
                console.error("Erreur lors du getUsers:", error);
            });
    }

    const filterUsers = (role) => {
        return users.filter(user => user.role === role);
    }

    const addUser = async (values, form) => {
        console.log("addUser called with:", values);
        const {setError, reset} = form;

        return await UsersApis.create(values)
            .then(({data}) => {
                setUsers([...users,data]);
                toast({
                    variant: "success",
                    title: 'Ajout réussi',
                    description: `Utilisateur "${data.name}" ajouté avec succès.`
                });

                reset();
            })
            .catch(({ response }) => {
                if (response?.data?.errors) {
                    Object.entries(response.data.errors).forEach(([key, messages]) => {
                        setError(key, { message: messages.join() });
                    });
                }
            });
    };

    const updateUser = async (id, values) => {
        return await UsersApis.update(id, values)
            .then(({ data }) => {
                setUsers(users.map(u => u.id === id ? data : u));
                toast({
                    variant: "success",
                    title: 'Mise à jour réussie',
                    description: `Utilisateur "${data.name}" mis à jour avec succès.`
                });
            })
            .catch(({ response }) => {
                if (response?.data?.errors) {
                    Object.entries(response.data.errors).forEach(([key, messages]) => {
                        form.setError(key, { message: messages.join() });
                    });
                }
            });
    };

    const toggleUserStatus = async (user) => {
        try {
            const response = await UsersApis.setIsActive(user.id);
            const updatedUser = response.data || response; // ← ici

            setUsers(users.map(u => u.id === user.id ? updatedUser : u));

            toast({
                variant: "success",
                title: 'Statut mis à jour',
                description: `Utilisateur "${updatedUser.name}" est maintenant ${updatedUser.is_active ? 'actif' : 'inactif'}.`
            });
        } catch (error) {
            console.error("Erreur changement statut utilisateur:", error);
        }
    };

    const resetUserPassword = async (user) => {
        try {
            // Appel au backend pour générer le nouveau mot de passe
            const { data } = await UsersApis.resetPassword(user.id);

            // data.password contient le nouveau mot de passe
            return data.password;

        } catch (error) {
            console.error("Erreur réinitialisation mot de passe :", error);
            toast({
                variant: "destructive",
                title: 'Erreur',
                description: `Impossible de réinitialiser le mot de passe pour "${user.name}".`
            });
            return null;
        }
    };

    return (
        <UsersContext.Provider value={{
            users, getUsers, filterUsers, addUser, updateUser, toggleUserStatus, resetUserPassword
        }}>
            {children}
        </UsersContext.Provider>
    )
};

export const useUsersContext = () => useContext(UsersContext);