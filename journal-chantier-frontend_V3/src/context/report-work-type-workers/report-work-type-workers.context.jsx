import {createContext, useContext, useState} from "react";

import {useToast} from "../../hooks/use-toast.js";

import ReportWorkTypeApis from "../../apis/report-work-type.apis.jsx";
import ReportWorkTypeWorkerApis from "../../apis/report-work-type-worker.apis.jsx";
import WorkersApis from "../../apis/workers.apis.jsx";

const ReportWorkTypeWorkersContext = createContext({
    reportWorkType: {},
    reportWorkTypeWorkers: {},
    workers: {},
    getReportWorkType: () => {},
    getReportWorkTypeWorkers: () => {},
    getWorkers: () => {},
    addReportWorkTypeWorker: () => {},
    updateReportWorkTypeWorker: () => {},
    deleteReportWorkTypeWorker: () => {},
});

export const ReportWorkTypeWorkersProvider = ({children}) => {
    const [reportWorkType, setReportWorkType] = useState([]);
    const [reportWorkTypeWorkers, setReportWorkTypeWorkers] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [siteId, setSiteId] = useState(null);

    const {toast} = useToast();

    const getReportWorkType = async id => {
        await ReportWorkTypeApis.getReportWorkType(id)
            .then(({data}) => {
                setReportWorkType(data.reportWorkType);

                setSiteId(data.reportWorkType.site_id);
            })
            .catch(error => console.warn(error));
    };

    const getReportWorkTypeWorkers = async (reportWorkTypeId) => {
        await ReportWorkTypeWorkerApis.getReportWorkTypeWorkers(reportWorkTypeId)
            .then(({data}) => {
                setReportWorkTypeWorkers(data);
            })
            .catch(error => console.warn(error));
    }

    const getWorkers = async () => {
        await WorkersApis.getWorkers()
            .then(({data}) => {
                console.log(siteId);
                console.log(data.filter(worker => worker.site_id === siteId));

                setWorkers(data
                    // .filter(worker => worker.site_id === siteId)
                    .map(worker => {
                        return {
                            value: worker.id,
                            label: `${worker.registration_number} - ${worker.name}`,
                            type:worker.type,
                        }
                    })
                );
            })
            .catch(error => {});
    }

    // const addReportWorkTypeWorker = async (values, form, reportWorkTypeId) => {
    //     const {setError, reset} = form;
    //
    //     const payload = {...values, report_work_type_id: reportWorkTypeId};
    //
    //     return await ReportWorkTypeWorkerApis.create(payload)
    //         .then(response => {
    //             if (response.status === 201) {
    //                 setReportWorkTypeWorkers([
    //                     ...reportWorkTypeWorkers,
    //                     response.data.reportWorkTypeWorker]);
    //
    //                 toast({
    //                     variant: 'success',
    //                     title: 'Ajout réussi',
    //                     description: `Pointage d'ouvrier a été ajouté avec succès`
    //                 });
    //
    //                 reset();
    //             }
    //         })
    //         .catch(({response}) => {
    //             setError("report_work_type_id", {
    //                 message: response.data.errors.report_work_type_id.join()
    //             })
    //             setError("worker_id", {
    //                 message: response.data.errors.worker_id.join()
    //             })
    //             setError("normal_hours", {
    //                 message: response.data.errors.normal_hours.join()
    //             })
    //             setError("overtime_hours", {
    //                 message: response.data.errors.overtime_hours.join()
    //             })
    //         });
    // }

    const addReportWorkTypeWorker = async (values, form, reportWorkTypeId,reportId) => {
        const {setError, reset} = form;

        const checkResponse = await ReportWorkTypeWorkerApis.checkReportWorkTypeWorker(
            values.worker_id,
            reportId
        );

        if (checkResponse.data.exists) {

            setError("worker_id", {
                message: "Cet ouvrier est déjà affecté à un chantier pour cette date."
            });

            toast({
                variant: 'danger',
                title: 'Affectation impossible',
                description: "Cet ouvrier est déjà affecté à un chantier pour cette date."
            });

            return;
        }

        const payload = {...values, report_work_type_id: reportWorkTypeId};

        return await ReportWorkTypeWorkerApis.create(payload)
            .then(response => {
                if (response.status === 201) {
                    setReportWorkTypeWorkers([
                        ...reportWorkTypeWorkers,
                        response.data.reportWorkTypeWorker]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Pointage d'ouvrier a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("report_work_type_id", {
                    message: response.data.errors.report_work_type_id.join()
                })
                setError("worker_id", {
                    message: response.data.errors.worker_id.join()
                })
                setError("normal_hours", {
                    message: response.data.errors.normal_hours.join()
                })
                setError("overtime_hours", {
                    message: response.data.errors.overtime_hours.join()
                })
            });
    }

    const updateReportWorkTypeWorker = async (id, values, form, reportWorkTypeId) => {
        const {setError, reset} = form;

        const payload = {...values, report_work_type_id: reportWorkTypeId};

        return await ReportWorkTypeWorkerApis.update(id, payload)
            .then(response => {
                if (response.status === 200) {
                    setReportWorkTypeWorkers(
                        reportWorkTypeWorkers.map(reportWorkTypeWorkerItem => reportWorkTypeWorkerItem.id !== id ? reportWorkTypeWorkerItem : response.data.reportWorkTypeWorker)
                    );

                    toast({
                        variant: 'success',
                        title: 'Mise à jour réussie',
                        description: `Pointage d'ouvrier a été mis à jour avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("report_work_type_id", {
                    message: response.data.errors.report_work_type_id.join()
                })
                setError("worker_id", {
                    message: response.data.errors.worker_id.join()
                })
                setError("normal_hours", {
                    message: response.data.errors.normal_hours.join()
                })
                setError("overtime_hours", {
                    message: response.data.errors.overtime_hours.join()
                })
            });
    }

    const deleteReportWorkTypeWorker = async (reportWorkTypeWorker) => {
        await ReportWorkTypeWorkerApis.delete(reportWorkTypeWorker.id)
            .then(response => {
                if (response.status === 200) {
                    setReportWorkTypeWorkers(reportWorkTypeWorkers.filter(reportWorkTypeWorkerItem => reportWorkTypeWorkerItem.id !== reportWorkTypeWorker.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Pointage d'ouvrier a été supprimé avec succès`
                    });
                }
            })
            .catch(error => console.warn(error));
    }

    return (
        <ReportWorkTypeWorkersContext.Provider value={{
            reportWorkType,
            reportWorkTypeWorkers,
            workers,
            getReportWorkType,
            getReportWorkTypeWorkers,
            getWorkers,
            addReportWorkTypeWorker,
            updateReportWorkTypeWorker,
            deleteReportWorkTypeWorker,
        }}>
            {children}
        </ReportWorkTypeWorkersContext.Provider>
    )
};

export const useReportWorkTypeWorkersContext = () => useContext(ReportWorkTypeWorkersContext);
