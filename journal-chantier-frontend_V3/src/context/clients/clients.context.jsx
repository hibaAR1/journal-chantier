import {createContext, useContext, useState} from "react";

import ClientsApis from "../../apis/clients.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const ClientsContext = createContext({
    clients: {},
    getClients: () => {
    },
    addClient: () => {
    },
    updateClient: () => {
    },
    deleteClient: () => {
    },
});

export const ClientsProvider = ({children}) => {
    const [clients, setClients] = useState([]);

    const {toast} = useToast();

    const getClients = async () => {
        await ClientsApis.getClients()
            .then(({data}) => {
                setClients(data);
            })
            .catch(error => console.warn(error));
    }

    const addClient = async (values, form) => {
        const {setError, reset} = form;

        return await ClientsApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setClients([...clients, response.data.client]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Client "${response.data.client.registered_name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("registered_name", {
                    message: response.data.errors.registered_name.join()
                })
                setError("code_system", {
                    message: response.data.errors.code_system.join()
                })
            });
    }

    const updateClient = async (id, values, form) => {
        const {setError, reset} = form;

        return await ClientsApis.update(id, values)
            .then(response => {
                if (response.status === 200 && response.data?.client) {
                    setClients(clients.map(clientItem =>
                        clientItem.id !== id ? clientItem : response.data.client));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Client "${response.data.client.registered_name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                if (response?.status === 403) {
                    toast({
                        variant: 'warning',
                        title: 'Modification refusée',
                        description: response.data?.error || 'Ce client est lié à un ou plusieurs sites.'
                    })
                } else if (response?.data?.error) {
                    if (response.data.errors.registered_name) {
                        setError("registered_name", {
                            message: response.data.errors.registered_name.join()
                        });
                    }
                    if (response.data.errors.code_system) {
                        setError("code_system", {
                            message: response.data.errors.code_system.join()
                        });
                    }
                } else {
                    toast({
                        variant: 'danger',
                        title: 'Erreur inconnue',
                        description: 'Une erreur est survenue lors de la modification du client.'
                    });
                }
            });
    }

    const deleteClient = async (client) => {
        return await ClientsApis.delete(client.id)
            .then(response => {
                if (response.status === 200) {
                    setClients(clients.filter(clientItem => clientItem.id !== client.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Client "${client.registered_name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {
                if (response?.status === 403) {
                    toast({
                        variant: 'danger',
                        title: 'Suppression refusée',
                        description: response.data?.error || `Impossible de supprimer ce client car il est lié à un ou plusieurs sites.`
                    });
                } else {
                    toast({
                        variant: 'danger',
                        title: 'Erreur serveur',
                        description: `Une erreur est survenue lors de la suppression du client`
                    });
                }
            });
    }

    return (
        <ClientsContext.Provider value={{
            clients, getClients, addClient, updateClient, deleteClient
        }}>
            {children}
        </ClientsContext.Provider>
    )
};

export const useClientsContext = () => useContext(ClientsContext);
