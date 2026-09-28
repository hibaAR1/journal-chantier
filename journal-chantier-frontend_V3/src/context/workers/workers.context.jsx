import {createContext, useContext, useState} from "react";

import {saveAs} from 'file-saver';

import WorkersApis from "../../apis/workers.apis.jsx";
import ResourcesApis from "../../apis/resources.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";
import {useLoadingContext} from "../loading/loading.context.jsx";

const WorkersContext = createContext({
    workers: {},
    resources: {},
    getWorkers: () => {},
    getResources: () => {},
    addWorker: () => {},
    updateWorker: () => {},
    deleteWorker: () => {},
    exportWorkers: () => {},
    uploadWorkers: () => {},
    exportAllWorkers: () => {}
});

export const WorkersProvider = ({children}) => {
    const {setImportLoading, setExportLoading, setLoading} = useLoadingContext();

    const [workers, setWorkers] = useState([]);
    const [resources, setResources] = useState([]);

    const {toast} = useToast();

    const getWorkers = async () => {
        await WorkersApis.getWorkers()
            .then(({data}) => {
                setWorkers(data);
            })
            .catch(error => console.warn(error));
    }

    const getResources = async () => {
        await ResourcesApis.getResources()
            .then(({data}) => {
                setResources(data.filter(resource => resource.type === 1).map(resource => {
                    return {
                        value: resource.id,
                        label: `${resource.name}`
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const addWorker = async (values, form) => {
        const {setError, reset} = form;

        return await WorkersApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setWorkers([...workers, response.data.worker]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Ouvrier "${response.data.worker.name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("resource_id", {
                    message: response.data.errors.resource_id.join()
                })
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("contract_type", {
                    message: response.data.errors.name.join()
                })
            });
    }

    const updateWorker = async (id, values, form) => {
        const {setError, reset} = form;

        return await WorkersApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setWorkers(workers.map(workerItem => workerItem.id !== id ? workerItem : response.data.worker));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Ouvrier "${response.data.worker.name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("resource_id", {
                    message: response.data.errors.resource_id.join()
                })
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("contract_type", {
                    message: response.data.errors.name.join()
                })
            });
    }

    const deleteWorker = async (worker) => {
        return await WorkersApis.delete(worker.id)
            .then(response => {
                if (response.status === 200) {
                    setWorkers(workers.filter(workerItem => workerItem.id !== worker.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Ouvrier "${worker.name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    const exportWorkers = async () => {
        setExportLoading(true);

        return await WorkersApis.export()
            .then((response) => {
                const contentDisposition = response.headers['content-disposition'];
                const fileNameMatch = contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
                const fileName = fileNameMatch ? fileNameMatch[1] : 'ouvriers.xlsx';

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

    const uploadWorkers = async (values, form) => {
        const {setError, reset} = form;

        const handleSuccess = async () => {
            await getWorkers();

            toast({
                variant: 'success',
                title: 'Importation réussie',
                description: `Ouvriers ont été importés avec succès`
            });

            setImportLoading(false);
            setLoading(false);
        }

        setImportLoading(true);

        setLoading(true);

        return await WorkersApis.upload(values)
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
                    description: `Une erreur s'est produite lors de l'importation des ouvriers`
                });

                setImportLoading(false);
                setLoading(false);
            });
    }
    const downloadExcelFile = (response, defaultFileName) => {
        const contentDisposition = response.headers['content-disposition'];

        const fileNameMatch =
            contentDisposition &&
            contentDisposition.match(/filename="?([^"]+)"?/);

        const fileName =
            fileNameMatch
                ? fileNameMatch[1]
                : defaultFileName;

        const blob = new Blob(
            [response.data],
            {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        );

        saveAs(blob, fileName);
    };

    const exportAllWorkers = async () => {
        setExportLoading(true);

        return await WorkersApis.exportAll()
            .then((response) => {

                downloadExcelFile(
                    response,
                    'ouvriers-export.xlsx'
                );

                toast({
                    variant: 'success',
                    title: 'Téléchargement réussi',
                    description: 'Liste des ouvriers téléchargée avec succès'
                });

                setExportLoading(false);
            })
            .catch(() => {

                toast({
                    variant: 'danger',
                    title: 'Erreur export',
                    description: 'Erreur lors du téléchargement des ouvriers'
                });

                setExportLoading(false);
            });
    }

    return (
        <WorkersContext.Provider value={{
            workers, resources, getWorkers, getResources, addWorker, updateWorker, deleteWorker, exportWorkers, uploadWorkers, exportAllWorkers
        }}>
            {children}
        </WorkersContext.Provider>
    )
};

export const useWorkersContext = () => useContext(WorkersContext);