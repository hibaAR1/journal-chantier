import {createContext, useContext, useState} from "react";

import {useToast} from "../../hooks/use-toast.js";

import ReportsApis from "../../apis/reports.apis.jsx";
import ReportResourceApis from "../../apis/report-resource.apis.jsx";
import ResourcesApis from "../../apis/resources.apis.jsx";

const ReportResourcesContext = createContext({
    report: {},
    reportResources: {},
    resources: {},
    getReport: () => {},
    getReportResources: () => {},
    getResources: () => {},
    addReportResource: () => {},
    updateReportResource: () => {},
    deleteReportResource: () => {},
});

export const ReportResourcesProvider = ({children}) => {
    const [report, setReport] = useState([]);
    const [reportResources, setReportResources] = useState([]);
    const [resources, setResources] = useState([]);

    const {toast} = useToast();

    const getReport = async id => {
        await ReportsApis.getReport(id)
            .then(({data}) => {
                setReport(data.report);
            })
            .catch(error => console.warn(error));
    };

    const getReportResources = async (reportId) => {
        await ReportResourceApis.getReportResources(reportId)
            .then(({data}) => {
                setReportResources(data);
            })
            .catch(error => console.warn(error));
    }

    const getResources = async () => {
        await ResourcesApis.getResources()
            .then(({data}) => {
                setResources(data.map(resource => {
                    return {
                        value: resource.id,
                        label: `${resource.type === 1 ? "Main Oeuvres" : "Matérial & Equipements"} - ${resource.name}`
                    }
                }));
            })
            .catch(error => {});
    }

    const addReportResource = async (values, form, reportId) => {
        const {setError, reset} = form;

        const payload = {...values, report_id: reportId};

        return await ReportResourceApis.create(payload)
            .then(response => {
                if (response.status === 201) {
                    setReportResources([...reportResources, response.data.reportResource]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Journal général a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("resource_id", {
                    message: response.data.errors.resource_id.join()
                })
                setError("number", {
                    message: response.data.errors.number.join()
                })
                setError("number_operations", {
                    message: response.data.errors.number_operations.join()
                })
                setError("number_downs", {
                    message: response.data.errors.number_downs.join()
                })
                setError("number_stops", {
                    message: response.data.errors.number_stops.join()
                })
                setError("observations", {
                    message: response.data.errors.observations.join()
                })
            });
    }

    const updateReportResource = async (id, values, form, reportId) => {
        const {setError, reset} = form;

        const payload = {...values, report_id: reportId};

        return await ReportResourceApis.update(id, payload)
            .then(response => {
                if (response.status === 200) {
                    setReportResources(reportResources.map(reportResourceItem => reportResourceItem.id !== id ? reportResourceItem : response.data.reportResource));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Journal général a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("resource_id", {
                    message: response.data.errors.resource_id.join()
                })
                setError("number", {
                    message: response.data.errors.number.join()
                })
                setError("number_operations", {
                    message: response.data.errors.number_operations.join()
                })
                setError("number_downs", {
                    message: response.data.errors.number_downs.join()
                })
                setError("number_stops", {
                    message: response.data.errors.number_stops.join()
                })
                setError("observations", {
                    message: response.data.errors.observations.join()
                })
            });
    }

    const deleteReportResource = async (reportResource) => {
        await ReportResourceApis.delete(reportResource.id)
            .then(response => {
                if (response.status === 200) {
                    setReportResources(reportResources.filter(reportResourceItem => reportResourceItem.id !== reportResource.id));

                    toast({
                        variant: 'success',
                        title: 'Suppression réussie',
                        description: `Journal général a été supprimé avec succès`
                    });
                }
            })
            .catch(error => console.warn(error));
    }

    return (
        <ReportResourcesContext.Provider value={{
            report, reportResources, resources, getReport, getReportResources, getResources, addReportResource, updateReportResource, deleteReportResource
        }}>
            {children}
        </ReportResourcesContext.Provider>
    )
};

export const useReportResourcesContext = () => useContext(ReportResourcesContext);
