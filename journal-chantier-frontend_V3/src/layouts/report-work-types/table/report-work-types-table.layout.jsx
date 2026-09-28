import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

import { useReportWorkTypesContext } from "../../../context/report-work-types/report-work-types.context.jsx";
import { useLoadingContext } from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import { ReportWorkTypesColumnsLayout } from "../columns/report-work-types-columns.layout.jsx";
import ReportWorkTypesStoreLayout from "../store/report-work-types-store.layout.jsx";
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

import { format } from "date-fns";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";

const ReportWorkTypesTableLayout = ({ reportId }) => {
    const {
        reportWorkTypes,
        report,
        getReport,
        getWorkTypes,
        reinstateReportWorkType
    } = useReportWorkTypesContext();

    const { loading, setLoading } = useLoadingContext();
    const { user } = useAuthContext();
    const permissions = user?.permissions || [];

    // --- STATES ---
    const [reportedTasks, setReportedTasks] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [reinstatedTasks, setReinstatedTasks] = useState([]); // <<< AJOUT IMPORTANT

    const [taskToReinstate, setTaskToReinstate] = useState(null);
    const [isReinstateModalOpen, setIsReinstateModalOpen] = useState(false);

    const listVisibles = [
        'Travail', 'Tâche',
        'Bloc', 'Emplacement', 'Element',
        'Etat du travail %', 'Quantité Réalisée',
        'Observations', 'Actions'
    ];

    const hiddenColumns = { 'observations': false };

    // const formatObservation = (text) => {
    //     if (!text) return "";
    //
    //     return text
    //         .replace(/@/g, "à")
    //         .replace(/`/g, "'")
    //         .replace(/\|/g, "\n");
    // };

    const formatObservation = (text) => {
        if (!text) return "";

        // ─── Fix double encodage UTF-8 interprété en Latin-1 ───
        let fixed = text;
        try {
            // Convertit "Tâche reportÃ©e" → "Tâche reportée"
            fixed = decodeURIComponent(
                Array.from(text).map(c =>
                    c.charCodeAt(0) > 127
                        ? '%' + c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()
                        : c
                ).join('')
            );
        } catch {
            fixed = text;
        }

        return fixed
            .replace(/@/g, "à")
            .replace(/`/g, "'")
            .replace(/\|/g, "\n");
    };

    // Charger les données
    const loadData = async () => {
        setLoading(true);
        await getReport(reportId);
        await getWorkTypes(report.site_id);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [reportId]);

// Appelé dès que report est réellement mis à jour
    useEffect(() => {
        if (report?.site_id !== undefined) {
            getWorkTypes(report.site_id);
        }
    }, [report]);
    // Séparer les tâches
    useEffect(() => {
        const list = Array.isArray(reportWorkTypes) ? reportWorkTypes : [];
        const normalizedList = list.map(t => ({
            ...t,
            is_reported: t.is_reported == 1 || t.is_reported === true,
            is_reinstated: t.is_reinstated == 1 || t.is_reinstated === true,
        }));

        // Ne pas retirer l'ancienne tâche du tableau
        const reinstated = normalizedList.filter(t => t.is_reinstated);
        const reported = normalizedList.filter(t => t.is_reported && !t.is_reinstated);
        const today = normalizedList.filter(t => !t.is_reported && !t.is_reinstated);

        setReinstatedTasks(reinstated);
        setReportedTasks(reported);
        setTodayTasks(today);
    }, [reportWorkTypes]);

    const combinedData = [
        ...todayTasks,
        ...(reinstatedTasks.length > 0 ? [{ id: "sep_reinstated", is_separator: "reinstated" }] : []),
        ...reinstatedTasks,
    ];

    // Réintégration
    const handleReinstate = async (task) => {
        try {
            const payload = {
                stat_work: task.stat_work,
                quantity_completed: task.quantity_completed
            };

            const newTask = await reinstateReportWorkType(task.id, reportId, payload);

            if (newTask) {
                // Ne pas supprimer task de reportedTasks
                setTodayTasks(prev => [...prev, newTask]);

                setTaskToReinstate(null);
                setIsReinstateModalOpen(false);
            }
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <>
            {loading ? (
                <LoadingComponent />
            ) : (
                <div className="w-full">
                    <h2 className="pt-2 px-4 font-bold">
                        {report?.site_name} | {report?.date ? format(new Date(report.date), 'dd-MM-yyyy') : ""}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-2 mb-4">

                        <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 shadow-sm">
                            <div className="text-sm text-orange-700">
                                Tâches reportées
                            </div>

                            <div className="text-2xl font-bold text-orange-900">
                                {reportedTasks.length}
                            </div>
                        </div>

                        <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 shadow-sm">
                            <div className="text-sm text-blue-700">
                                Tâches du jour
                            </div>

                            <div className="text-2xl font-bold text-blue-900">
                                {todayTasks.length}
                            </div>
                        </div>

                        <div className="bg-green-100 border border-green-200 rounded-lg p-3 shadow-sm">
                            <div className="text-sm text-green-700">
                                Tâches réintégrées
                            </div>

                            <div className="text-2xl font-bold text-green-900">
                                {reinstatedTasks.length}
                            </div>
                        </div>

                    </div>

                    {/* Bloc tâches reportées */}
                    {reportedTasks.length > 0 && (
                        <div className="p-2 rounded-lg border border-gray-300 bg-gray-100 mb-4">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Tâches reportées des jours précédents
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse bg-white rounded-md shadow-sm text-sm">
                                    <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                        <th className="px-2 py-1 border text-left">Travail</th>
                                        <th className="px-2 py-1 border text-left">Bloc / Élément</th>
                                        <th className="px-2 py-1 border text-left">Statut</th>
                                        <th className="px-2 py-1 border text-left">Observations</th>
                                        <th className="px-2 py-1 border text-center">Action</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {reportedTasks.map(task => (
                                        <tr key={task.id} className="hover:bg-gray-50 transition">
                                            <td className="px-2 py-1 border font-semibold text-gray-800">
                                                {task.work_type_name}
                                            </td>

                                            <td className="px-2 py-1 border text-gray-600">
                                                Bloc : {task.site_location_block} — Élement : {task.site_location_element}
                                            </td>

                                            <td className="px-2 py-1 border text-gray-700">
                                                <b>{task.stat_work}%</b>
                                            </td>

                                            <td className="px-2 py-1 border text-gray-500 italic">
                                                <div className="whitespace-pre-line">
                                                    {formatObservation(task.observations)}
                                                </div>
                                            </td>

                                            <td className="px-2 py-1 border text-center">
                                                <button
                                                    className="px-2 py-0.5 text-xs text-white rounded transition"
                                                    style={{ backgroundColor: "#d76a3e" }}
                                                    onClick={() => {
                                                        setTaskToReinstate(task);
                                                        setIsReinstateModalOpen(true);
                                                    }}
                                                >
                                                    Réintégrer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}



                    {/* Tableau */}
                    <DataTableComponent
                        addBtn={permissions.includes("store report work types") && <ReportWorkTypesStoreLayout reportId={reportId} />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData} />}

                        // Nouvelle couleur des réintégrations
                        columns={ReportWorkTypesColumnsLayout().map(col => ({
                            ...col,
                            cellStyle: (row) => row.is_reinstated ? { backgroundColor: "#fff4e6" } : {}
                        }))}

                        data={combinedData}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                        rowClassFn={(row) => {
                            if (row.is_separator) return "separator-row";
                            if (row.is_reinstated) return "reinstated-task-row";
                            return "";
                        }}
                    />

                    {/* Modal */}
                    {isReinstateModalOpen && taskToReinstate && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                                <h2 className="text-lg font-bold mb-4 text-gray-800">Réintégrer la tâche</h2>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Statut du travail (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={taskToReinstate.stat_work}
                                        onChange={e =>
                                            setTaskToReinstate({...taskToReinstate, stat_work: parseFloat(e.target.value)})
                                        }
                                        className="mt-1 w-full border rounded px-2 py-1 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Quantité réalisée</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={taskToReinstate.quantity_completed}
                                        onChange={e =>
                                            setTaskToReinstate({...taskToReinstate, quantity_completed: parseFloat(e.target.value)})
                                        }
                                        className="mt-1 w-full border rounded px-2 py-1 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                        onClick={() => setIsReinstateModalOpen(false)}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        className="px-3 py-1 text-white rounded transition"
                                        style={{
                                            backgroundColor: "#d76a3e"
                                        }}
                                        onMouseEnter={e => (e.target.style.backgroundColor = "#b85c35")}
                                        onMouseLeave={e => (e.target.style.backgroundColor = "#d76a3e")}
                                        onClick={() => handleReinstate(taskToReinstate)}
                                    >
                                        Confirmer
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

ReportWorkTypesTableLayout.propTypes = {
    reportId: PropTypes.string.isRequired,
};

export default ReportWorkTypesTableLayout;