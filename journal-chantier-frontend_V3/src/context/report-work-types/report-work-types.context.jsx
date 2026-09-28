import {createContext, useContext, useState} from "react";

import {useToast} from "../../hooks/use-toast.js";

import ReportsApis from "../../apis/reports.apis.jsx";
import ReportWorkTypeApis from "../../apis/report-work-type.apis.jsx";
import WorkTypesApis from "../../apis/work-types.apis.jsx";
import SiteLocationApis from "../../apis/site-location.apis.jsx";

const ReportWorkTypesContext = createContext({
    report: {},
    reportWorkTypes: [],
    workTypes: [],
    siteLocations: [],
    getReport: () => {
    },
    getReportWorkTypes: () => {
    },
    getWorkTypes: (siteId) => {
    },
    addReportWorkType: () => {
    },
    updateReportWorkType: () => {
    },
    deleteReportWorkType: () => {
    },
    reinstateReportWorkType: () => {
    },
});

export const ReportWorkTypesProvider = ({children}) => {
    const [report, setReport] = useState({});
    const [reportWorkTypes, setReportWorkTypes] = useState([]);

    const [workTypes, setWorkTypes] = useState([]);
    const [siteLocations, setSiteLocations] = useState([]);

    const {toast} = useToast();

    // -----------------------------------------------------
    //   GET REPORT
    // -----------------------------------------------------
    const getReport = async id => {
        try {
            const {data} = await ReportsApis.getReport(id);

            console.log('📌 FULL REPORT API RESPONSE :', data);

            // Stocker le rapport principal
            setReport(data.report);

            // Fusionner toutes les tâches
            const allTasks = [
                ...(data.reportedTasks || []),   // Tâches reportées
                ...(data.today_tasks || [])      // Tâches du jour
            ];

            setReportWorkTypes(allTasks);

            // Mettre à jour les site locations
            setSiteLocations(
                data.report.site_locations?.map(sl => ({
                    value: sl.id,
                    label: `${sl.block} - ${sl.location_name} - ${sl.element}`
                })) || []
            );

        } catch (error) {
            console.warn(error);
        }
    };

    // -----------------------------------------------------
    //   GET REPORT WORK TYPES
    // -----------------------------------------------------
    const getReportWorkTypes = async reportId => {
        try {
            const {data} = await ReportWorkTypeApis.getReportWorkTypes(reportId);

            setReportWorkTypes(data || []);

            console.log("📌 DATA REPORT WORK TYPES :", data);

        } catch (error) {
            console.warn(error);
        }
    };

    // -----------------------------------------------------
    //   GET WORK TYPES
    // -----------------------------------------------------
    const getWorkTypes = async (siteId) => {
        const effectiveSiteId = siteId ?? report?.site_id ?? null;
        await WorkTypesApis.getWorkTypes()
            .then(({data}) => {
                const rows = Array.isArray(data) ? data : data.data;
                const filtered = effectiveSiteId === null
                    ? rows.filter(wt => wt.scope === 'G')
                    : rows.filter(wt =>
                        wt.scope === 'G' || wt.site_id === effectiveSiteId
                    );
                setWorkTypes(filtered.map(workType => {
                    return {
                        value: workType.id,
                        label: `${workType.work_name} - ${workType.name}`,
                        scope: workType.scope,
                        site_id: workType.site_id,
                        t_u: workType.t_u,
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    // -----------------------------------------------------
    //   ADD REPORT WORK TYPE
    // -----------------------------------------------------
    const addReportWorkType = async (values, form, reportId) => {
        const {setError, reset} = form;

        const payload = {...values, report_id: reportId};

        try {
            const response = await ReportWorkTypeApis.create(payload);

            if (response.status === 201) {
                setReportWorkTypes(prev => [...prev, response.data.reportWorkType]);

                toast({
                    variant: 'success',
                    title: 'Ajout réussi',
                    description: 'Journal du travail ajouté.'
                });

                reset();
            }

        } catch ({response}) {
            setError("work_type_id", {
                message: response.data.errors.work_type_id?.join()
            });
            setError("site_location_id", {
                message: response.data.errors.site_location_id?.join()
            });
            setError("stat_work", {
                message: response.data.errors.stat_work?.join()
            });
            setError("quantity_completed", {
                message: response.data.errors.quantity_completed?.join()
            });
            setError("observations", {
                message: response.data.errors.observations?.join()
            });
        }
    };

    // -----------------------------------------------------
    //   UPDATE REPORT WORK TYPE
    // -----------------------------------------------------
    const updateReportWorkType = async (id, values, form, reportId) => {
        const {setError, reset} = form;

        const payload = {...values, report_id: reportId};

        try {
            const response = await ReportWorkTypeApis.update(id, payload);

            if (response.status === 200) {
                setReportWorkTypes(prev =>
                    prev.map(item => item.id === id ? response.data.reportWorkType : item)
                );

                toast({
                    variant: 'warning',
                    title: 'Modification réussie',
                    description: 'Journal du travail modifié.'
                });

                reset();
            }

        } catch ({response}) {
            setError("work_type_id", {message: response.data.errors.work_type_id?.join()});
            setError("site_location_id", {message: response.data.errors.site_location_id?.join()});
            setError("stat_work", {message: response.data.errors.stat_work?.join()});
            setError("quantity_completed", {message: response.data.errors.quantity_completed?.join()});
            setError("observations", {message: response.data.errors.observations?.join()});
        }
    };

    // -----------------------------------------------------
    //   DELETE REPORT WORK TYPE
    // -----------------------------------------------------
    const deleteReportWorkType = async reportWorkType => {
        try {
            const response = await ReportWorkTypeApis.delete(reportWorkType.id);

            if (response.status === 200) {
                setReportWorkTypes(prev =>
                    prev.filter(item => item.id !== reportWorkType.id)
                );

                toast({
                    variant: 'danger',
                    title: 'Suppression réussie',
                    description: 'Journal du travail supprimé.'
                });
            }

        } catch (error) {
            console.warn(error);
        }
    };

    // -----------------------------------------------------
    //   REINSTATE TASK
    // -----------------------------------------------------

    // -----------------------------------------------------
//   REINSTATE TASK
// -----------------------------------------------------
    const reinstateReportWorkType = async (taskId, reportId, payload) => {
        try {
            const response = await ReportWorkTypeApis.reinstate(taskId, reportId, payload);

            if (response.status === 200) {
                const newTask = response.data.task;

                setReportWorkTypes(prev => [
                    ...prev.filter(t => t.id !== taskId),
                    newTask
                ]);

                toast({
                    variant: 'success',
                    title: 'Réintégration réussie',
                    description: 'La tâche a été réintégrée avec les nouvelles valeurs.'
                });

                return newTask;
            }

        } catch (error) {
            console.error("Erreur réintégration :", error);
        }
    };




    return (
        <ReportWorkTypesContext.Provider
            value={{
                report,
                reportWorkTypes,
                workTypes,
                siteLocations,
                getReport,
                getReportWorkTypes,
                getWorkTypes,
                addReportWorkType,
                updateReportWorkType,
                deleteReportWorkType,
                reinstateReportWorkType,
            }}
        >
            {children}
        </ReportWorkTypesContext.Provider>
    );
};

export const useReportWorkTypesContext = () => useContext(ReportWorkTypesContext);
