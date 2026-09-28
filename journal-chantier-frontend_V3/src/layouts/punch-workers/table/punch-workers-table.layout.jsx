import {useEffect} from "react";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {usePunchWorkersContext} from "../../../context/punch-workers/punch-workers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {PunchWorkersColumnsLayout} from "../columns/punch-workers-columns.layout.jsx";

import PunchWorkersStoreLayout from "../store/punch-workers-store.layout.jsx";
import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {format} from "date-fns";
import PunchWorkersLinksLayout from "../links/punch-workers-links.layout.jsx";

const PunchWorkersTableLayout = ({punchId}) => {
    const {punchWorkers, punch, getPunchWorkers, getWorkers, getPunch} = usePunchWorkersContext();
    const {loading, setLoading, setExportLoading, setImportLoading} = useLoadingContext();
    const {user} = useAuthContext();
    const permissions = user?.permissions || [];

    const listVisibles = ['Ouvrier', 'Type','Direct/Indirect', 'Heures Normales', 'Heures Supplémentaires', 'Actions'];
    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);
        setExportLoading(false);
        setImportLoading(false);

        await getPunchWorkers(punchId);
        await getPunch(punchId);
        await getWorkers();

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    // Calcul des totaux
    const totalNH = punchWorkers.reduce((acc, worker) => acc + (worker.natural_hours || 0), 0);
    const totalHS = punchWorkers.reduce((acc, worker) => acc + (worker.overtime_hours || 0), 0);

    // Ligne total à afficher en haut
    const totalRow = {
        id: 'total',
        worker_name: '',
        resource_name: '',
        type: '',
        natural_hours: `Total H/N : ${totalNH}`,
        overtime_hours: `Total H/S : ${totalHS}`,
        isTotal: true  // flag pour le style
    };

    // Insérer la ligne total en haut du tableau
    const dataWithTotal = [totalRow, ...punchWorkers];

    return (
        <>
            {loading
                ? <LoadingComponent />
                : <div className="w-full">
                    <h2 className="pt-2 px-4 font-bold">
                        {punch.site_name} | {punch.date ? format(new Date(punch.date), 'dd-MM-yyyy') : ""}
                    </h2>
                    <DataTableComponent
                        addBtn={permissions.includes("store punches") && <PunchWorkersStoreLayout punchId={punchId} />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData} />}
                        linkBtn={<PunchWorkersLinksLayout punchId={punchId} />}
                        columns={PunchWorkersColumnsLayout()}
                        data={dataWithTotal}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
                </div>
            }
        </>
    )
}

export default PunchWorkersTableLayout;
