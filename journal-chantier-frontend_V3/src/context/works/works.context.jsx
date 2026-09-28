import {createContext, useContext, useState} from "react";

import WorksApis from "../../apis/works.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const WorksContext = createContext({
    works: {},
    getWorks: (siteId = null) => {
    },
    addWork: () => {
    },
    updateWork: () => {
    },
    deleteWork: () => {
    },
});

export const WorksProvider = ({children}) => {
    const [works, setWorks] = useState([]);

    const {toast} = useToast();

    const getWorks = async (siteId = null) => {
        await WorksApis.getWorks()
            .then(({data}) => {
                const filtered = siteId === null
                    ? data.filter(work => work.site_id === null)
                    : data.filter(work => work.site_id === siteId);
                setWorks(filtered);
            })
            .catch(error => console.warn(error));
    }

    const addWork = async (values, form, siteId = null) => {
        const {setError, reset} = form;

        const payload = {
            ...values,
            ...(siteId !== null ? {site_id: siteId} : {}),
        };

        return await WorksApis.create(payload)
            .then(response => {
                if (response.status === 201) {
                    setWorks([...works, response.data.work]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Travail "${response.data.work.name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("unit", {
                    message: response.data.errors.unit.join()
                })
            });
    }

    const updateWork = async (id, values, form, siteId = null) => {
        const {setError, reset} = form;

        const payload = {
            ...values,
            ...(siteId !== null ? {site_id: siteId} : {}),
        };

        return await WorksApis.update(id, payload)
            .then(response => {
                if (response.status === 200) {
                    setWorks(works.map(workItem => workItem.id !== id ? workItem : response.data.work));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Travail "${response.data.work.name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("unit", {
                    message: response.data.errors.unit.join()
                })
            });
    }

    const deleteWork = async (work) => {
        return await WorksApis.delete(work.id)
            .then(response => {
                if (response.status === 200) {
                    setWorks(works.filter(workItem => workItem.id !== work.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Travail "${work.name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <WorksContext.Provider value={{
            works, getWorks, addWork, updateWork, deleteWork
        }}>
            {children}
        </WorksContext.Provider>
    )
};

export const useWorksContext = () => useContext(WorksContext);
