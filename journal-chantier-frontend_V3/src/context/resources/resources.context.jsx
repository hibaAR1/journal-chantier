import {createContext, useContext, useState} from "react";

import ResourcesApis from "../../apis/resources.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const ResourcesContext = createContext({
    resources: {},
    getResources: () => {
    },
    addResource: () => {
    },
    updateResource: () => {
    },
    deleteResource: () => {
    },
});

export const ResourcesProvider = ({children}) => {
    const [resources, setResources] = useState([]);

    const {toast} = useToast();

    const getResources = async () => {
        await ResourcesApis.getResources()
            .then(({data}) => {
                setResources(data);
            })
            .catch(error => console.warn(error));
    }

    const addResource = async (values, form) => {
        const {setError, reset} = form;

        return await ResourcesApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setResources([...resources, response.data.resource]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Ressource "${response.data.resource.name}" a été ajoutée avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("abrv", {
                    message: response.data.errors.abrv.join()
                })
                setError("type", {
                    message: response.data.errors.type.join()
                })
            });
    }

    const updateResource = async (id, values, form) => {
        const {setError, reset} = form;

        return await ResourcesApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setResources(resources.map(resourceItem => resourceItem.id !== id ? resourceItem : response.data.resource));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Ressource "${response.data.resource.name}" a été modifiée avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("abrv", {
                    message: response.data.errors.abrv.join()
                })
                setError("type", {
                    message: response.data.errors.type.join()
                })
            });
    }

    const deleteResource = async (resource) => {
        return await ResourcesApis.delete(resource.id)
            .then(response => {
                if (response.status === 200) {
                    setResources(resources.filter(resourceItem => resourceItem.id !== resource.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Ressource "${resource.name}" a été supprimée avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <ResourcesContext.Provider value={{
            resources, getResources, addResource, updateResource, deleteResource
        }}>
            {children}
        </ResourcesContext.Provider>
    )
};

export const useResourcesContext = () => useContext(ResourcesContext);
