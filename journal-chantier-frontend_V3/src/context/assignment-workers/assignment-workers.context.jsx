import {createContext, useContext, useState} from "react";

import {saveAs} from 'file-saver';

import AssignmentsApis from "../../apis/assignments.apis.jsx";
import WorkersApis from "../../apis/workers.apis.jsx";
import AssignmentWorkersApis from "../../apis/assignment-worker.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";
import {useLoadingContext} from "../loading/loading.context.jsx";


const AssignmentWorkersContext = createContext({
    assignment: {},
    workers: {},
    assignmentWorkers: {},
    getAssignment: () => {
    },
    getWorkers: () => {
    },
    getAssignmentWorkers: () => {
    },
    addAssignmentWorker: () => {
    },
    updateAssignmentWorker: () => {
    },
    deleteAssignmentWorker: () => {
    },
    exportAssignmentWorkers: () => {
    },
    uploadAssignmentWorkers: () => {
    },
});

export const AssignmentWorkersProvider = ({children}) => {
    const {setImportLoading, setExportLoading, setLoading} = useLoadingContext();

    const [assignment, setAssignment] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [assignmentWorkers, setAssignmentWorkers] = useState([]);

    const {toast} = useToast();

    const getAssignment = async id => {
        await AssignmentsApis.getAssignment(id)
            .then(({data}) => {
                setAssignment(data);
            })
            .catch(error => console.warn(error));
    }

    const getWorkers = async () => {
        await WorkersApis.getWorkers()
            .then(({data}) => {
                setWorkers(data.map(worker => {
                    return {
                        value: worker.id,
                        label: `${worker.registration_number} -- ${worker.name}`
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const getAssignmentWorkers = async (assignmentId) => {
        await AssignmentWorkersApis.getAssignmentWorkers(assignmentId)
            .then(({data}) => {
                console.log("AssignmentWorkers", data);
                setAssignmentWorkers(data);
            })
            .catch(error => console.warn(error));
    }

    const addAssignmentWorker = async (values, form, assignmentId) => {
        const {setError, reset} = form;

        const payload = {...values, assignment_id: assignmentId};

        return await AssignmentWorkersApis.create(payload)
            .then(response => {
                if (response.status === 201) {
                    setAssignmentWorkers([...assignmentWorkers, response.data.assignmentWorker]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Affectation du "${response.data.assignmentWorker.worker_name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("worker_id", {
                    message: response.data.errors.worker_id.join()
                })
            });
    }

    const updateAssignmentWorker = async (id, values, form, assignmentId) => {
        const {setError, reset} = form;

        const payload = {...values, assignment_id: assignmentId};

        return await AssignmentWorkersApis.update(id, payload)
            .then(response => {
                if (response.status === 200) {
                    setAssignmentWorkers(assignmentWorkers.map(assignmentWorkerItem => assignmentWorkerItem.id !== id ? assignmentWorkerItem : response.data.assignmentWorker));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Affectation du "${response.data.assignmentWorker.worker_name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("worker_id", {
                    message: response.data.errors.worker_id.join()
                })
            });
    }

    const deleteAssignmentWorker = async (assignmentWorker) => {
        return await AssignmentWorkersApis.delete(assignmentWorker.id)
            .then(response => {
                if (response.status === 200) {
                    setAssignmentWorkers(assignmentWorkers.filter(assignmentWorkerItem => assignmentWorkerItem.id !== assignmentWorker.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Affectation du "${assignmentWorker.worker_name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {
            })
    }

    const exportAssignmentWorkers = async (assignmentId) => {
        setExportLoading(true);

        return await AssignmentWorkersApis.export(assignmentId)
            .then((response) => {
                const contentDisposition = response.headers['content-disposition'];
                const fileNameMatch = contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
                const fileName = fileNameMatch ? fileNameMatch[1] : 'affectations.xlsx';

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                saveAs(blob, fileName);

                toast({
                    variant: 'success',
                    title: 'Téléchargement réussi',
                    description: `Le fichier a été téléchargé avec succès`
                });

                setExportLoading(false);
            })
            .catch(({response}) => {

                setExportLoading(false);
            })
    }

    const uploadAssignmentWorkers = async (values, form, assignmentId) => {
        const {setError, reset} = form;

        const handleSuccess = async () => {
            await getAssignmentWorkers(assignmentId);

            toast({
                variant: 'success',
                title: 'Importation réussie',
                description: `Affectations des ouvriers ont été importés avec succès`
            });

            setImportLoading(false);
            setLoading(false);
        }

        setImportLoading(true);

        setLoading(true);

        return await AssignmentWorkersApis.upload(values)
            .then(() => {
                // setWorkers([...workers, ...response.data.workers]);
                handleSuccess();

            })
            .catch((error) => {
                console.error('Full Axios error:', error);
                console.log('Error message:', error.message);

                toast({
                    variant: 'danger',
                    title: 'Importation echouée',
                    description: `Une erreur s'est produite lors de l'importation des affectations`
                });

                setImportLoading(false);
                setLoading(false);
            });
    }

    return (
        <AssignmentWorkersContext.Provider value={{
            assignment,
            workers,
            assignmentWorkers,
            getAssignment,
            getWorkers,
            getAssignmentWorkers,
            addAssignmentWorker,
            updateAssignmentWorker,
            deleteAssignmentWorker,
            exportAssignmentWorkers,
            uploadAssignmentWorkers
        }}>
            {children}
        </AssignmentWorkersContext.Provider>
    )
};

export const useAssignmentWorkersContext = () => useContext(AssignmentWorkersContext);
