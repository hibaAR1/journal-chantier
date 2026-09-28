import {createContext, useContext, useState} from "react";

import WorkTypesApis from "../../apis/work-types.apis.jsx";
import WorksApis from "../../apis/works.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const WorkTypesContext = createContext({
    workTypes: {},
    works: {},
    getWorkTypes: () => {},
    getWorks: () => {},
    addWorkType: () => {},
    updateWorkType: () => {},
    deleteWorkType: () => {},
});

export const WorkTypesProvider = ({children}) => {
    const [workTypes, setWorkTypes] = useState([]);
    const [works, setWorks] = useState([]);

    const {toast} = useToast();

    const getWorkTypes = async (siteId = null) => {
        await WorkTypesApis.getWorkTypes()
            .then(({data}) => {
                const filtered = siteId === null
                    ? data.filter(t => t.site_id === null || t.scope === 'G')
                    : data.filter(t => t.site_id === siteId);
                setWorkTypes(filtered);
            })
            .catch(error => console.warn(error));
    }

    const getWorks = async (siteId = null) => {
        await WorksApis.getWorks()
            .then(({data}) => {
                const filtered = siteId === null
                    ? data.filter(work => work.site_id === null)
                    : data.filter(work => work.site_id === siteId);

                setWorks(filtered.map(work => {
                    return {
                        value: work.id,
                        label: work.name
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const addWorkType = async (values, form) => {
        const {setError, reset} = form;

        return await WorkTypesApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setWorkTypes([...workTypes, response.data.workType]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Tâche "${response.data.workType.name}" a été ajoutée avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                const errors = response?.data?.errors || {};

                if (errors.work_id) {
                    setError("work_id", {
                        message: errors.work_id.join()
                    });
                }

                if (errors.name) {
                    setError("name", {
                        message: errors.name.join()
                    });
                }

                if (errors.name) {
                    setError("unit", {
                        message: errors.unit.join()
                    });
                }

                if (errors.t_u) {
                    setError("t_u", {
                        message: errors.t_u.join()
                    });
                }
            });
    }

    const updateWorkType = async (id, values, form) => {
        const {setError, reset} = form;

        return await WorkTypesApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setWorkTypes(workTypes.map(workTypeItem => workTypeItem.id !== id ? workTypeItem : response.data.workType));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Tâche "${response.data.workType.name}" a été modifiée avec succès`
                    });

                    reset();
                }
            })
           .catch(({response}) => {
                const errors = response?.data?.errors || {};

                if (errors.work_id) {
                    setError("work_id", {
                        message: errors.work_id.join()
                    });
                }

                if (errors.name) {
                    setError("name", {
                        message: errors.name.join()
                    });
                }

               if (errors.name) {
                   setError("unit", {
                       message: errors.unit.join()
                   });
               }

                if (errors.t_u) {
                    setError("t_u", {
                        message: errors.t_u.join()
                    });
                }
            });
    }

    const deleteWorkType = async (workType) => {
        return await WorkTypesApis.delete(workType.id)
            .then(response => {
                if (response.status === 200) {
                    setWorkTypes(workTypes.filter(workTypeItem => workTypeItem.id !== workType.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Tâche "${workType.name}" a été supprimée avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <WorkTypesContext.Provider value={{
            workTypes, works, getWorkTypes, getWorks, addWorkType, updateWorkType, deleteWorkType
        }}>
            {children}
        </WorkTypesContext.Provider>
    )
};

export const useWorkTypesContext = () => useContext(WorkTypesContext);
