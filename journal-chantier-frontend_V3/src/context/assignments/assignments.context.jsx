import {createContext, useContext, useState} from "react";

import AssignmentsApis from "../../apis/assignments.apis.jsx";
import SitesApis from "../../apis/sites.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const AssignmentsContext = createContext({
    assignments: {},
    getAssignments: () => {},
    getSites: () => {},
    addAssignment: () => {},
    updateAssignment: () => {},
    deleteAssignment: () => {},
});

export const AssignmentsProvider = ({children}) => {
    const [assignments, setAssignments] = useState([]);
    const [sites, setSites] = useState([]);

    const {toast} = useToast();

    const getAssignments = async () => {
        await AssignmentsApis.getAssignments()
            .then(({data}) => {
                setAssignments(data);
            })
            .catch(error => console.warn(error));
    }

    const getSites = async () => {
        await SitesApis.getSites()
            .then(({data}) => {
                setSites(data.map(site => {
                    return {
                        value: site.id,
                        label: `${site.name}`
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const addAssignment = async (values, form) => {
        const {setError, reset} = form;

        return await AssignmentsApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setAssignments([...assignments, response.data.assignment]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Dossier affectations "${response.data.assignment.code}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("site_id", {
                    message: response.data.errors.site_id.join()
                })
            });
    }

    const updateAssignment = async (id, values, form) => {
        const {setError, reset} = form;

        return await AssignmentsApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setAssignments(assignments.map(assignmentItem => assignmentItem.id !== id ? assignmentItem : response.data.assignment));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Dossier affectations "${response.data.assignment.code}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("site_id", {
                    message: response.data.errors.site_id.join()
                })
            });
    }

    const deleteAssignment = async (assignment) => {
        return await AssignmentsApis.delete(assignment.id)
            .then(response => {
                if (response.status === 200) {
                    setAssignments(assignments.filter(assignmentItem => assignmentItem.id !== assignment.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Dossier affectations "${assignment.code}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <AssignmentsContext.Provider value={{
            assignments,
            sites,
            getAssignments,
            getSites,
            addAssignment,
            updateAssignment,
            deleteAssignment
        }}>
            {children}
        </AssignmentsContext.Provider>
    )
};

export const useAssignmentsContext = () => useContext(AssignmentsContext);
