import {createContext, useContext, useEffect, useState} from "react";

import SitesApis from "../../apis/sites.apis.jsx";
import ClientsApis from "../../apis/clients.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";
import UsersApis from "../../apis/users.apis.jsx";

const SitesContext = createContext({
    sites: {},
    clients: {},
    projectResponsibles: {},
    conductors: {},
    dataEntries : {},
    workers: {},
    getSites: () => {
    },
    getClients: () => {
    },
    getUsers: () => {
    },
    getProjectResponsibles: () => {
    },
    getConductors: () => {
    },
    getDataEntries: () => {
    },
    getWorkers: () => {
    },
    addSite: () => {
    },
    updateSite: () => {
    },
    deleteSite: () => {
    },
});

export const SitesProvider = ({children}) => {
    const [sites, setSites] = useState([]);
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [projectResponsibles, setProjectResponsibles] = useState([]);
    const [conductors, setConductors] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [dataEntries, setDataEntries] = useState([]);

    useEffect(() => {
        if (users) {
            getProjectResponsibles();

            getConductors();

            getWorkers();

            getDataEntries();
        }
    }, [users]);

    const {toast} = useToast();

    const getSites = async () => {
        await SitesApis.getSites()
            .then(({data}) => {
                console.log("data", data);
                setSites(data);
            })
            .catch(error => console.warn(error));
    }

    const getClients = async () => {
        await ClientsApis.getClients()
            .then(({data}) => {
                setClients(data.map(client => {
                    return {
                        value: client.id,
                        label: `${client.code_system} - ${client.registered_name}`
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const getUsers = async () => {
        await UsersApis.getUsers()
            .then(({data}) => {
                setUsers(data);
            })
            .catch(error => console.warn(error));
    }

    const getProjectResponsibles = () => {
        setProjectResponsibles(
            users
                .filter(user => user.role === 'project_responsible')
                .map(user => {
                    return {
                        value: user.id,
                        label: `${user.registration_number} - ${user.name}`
                    }
                })
        );
    }

    const getConductors = () => {
        setConductors(
            users
                .filter(user => user.role === 'conductor')
                .map(user => {
                    return {
                        value: user.id,
                        label: `${user.registration_number} - ${user.name}`
                    }
                })
        );
    }

    const getDataEntries = () => {
        setDataEntries(
            users
                .filter(user => user.role === 'data_entry')
                .map(user => {
                    return {
                        value: user.id,
                        label: `${user.registration_number} - ${user.name}`
                    }
                })
        );
    }

    const getWorkers = () => {
        setWorkers(
            users
                .filter(user => user.role === 'worker')
                .map(user => {
                    return {
                        value: user.id,
                        label: `${user.registration_number} - ${user.name}`
                    }
                })
        );
    }

    const addSite = async (values, form) => {
        const {setError, reset} = form;

        return await SitesApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setSites([...sites, response.data.site]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Chantier "${response.data.site.name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("client_id", {
                    message: response.data.errors.client_id.join()
                })
                setError("project_responsible_id", {
                    message: response.data.errors.project_responsible_id.join()
                })
                setError("conductor_id", {
                    message: response.data.errors.conductor_id.join()
                })
                setError("data_entry_id", {
                    message: response.data.errors.data_entry_id.join()
                })
                setError("worker_id", {
                    message: response.data.errors.worker_id.join()
                })
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("address", {
                    message: response.data.errors.address.join()
                })
            });
    }

    const updateSite = async (id, values, form) => {
        const {setError, reset} = form;

        return await SitesApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setSites(sites.map(siteItem => siteItem.id !== id ? siteItem : response.data.site));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Chantier "${response.data.site.name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("client_id", {
                    message: response.data.errors.client_id.join()
                })
                setError("project_responsible_id", {
                    message: response.data.errors.project_responsible_id.join()
                })
                setError("conductor_id", {
                    message: response.data.errors.conductor_id.join()
                })
                setError("data_entry_id", {
                    message: response.data.errors.data_entry_id.join()
                })
                setError("worker_id", {
                    message: response.data.errors.worker_id.join()
                })
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("address", {
                    message: response.data.errors.address.join()
                })
            });
    }

    const deleteSite = async (site) => {
        return await SitesApis.delete(site.id)
            .then(response => {
                if (response.status === 200) {
                    setSites(sites.filter(siteItem => siteItem.id !== site.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Chantier "${site.name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {
            })
    }

    return (
        <SitesContext.Provider value={{
            sites,
            clients,
            projectResponsibles,
            conductors,
            dataEntries,
            workers,
            getSites,
            getClients,
            getUsers,
            addSite,
            updateSite,
            deleteSite
        }}>
            {children}
        </SitesContext.Provider>
    )
};

export const useSitesContext = () => useContext(SitesContext);
