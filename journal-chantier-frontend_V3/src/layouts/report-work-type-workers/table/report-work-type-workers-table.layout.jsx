import PropTypes from 'prop-types';
import {useEffect} from "react";

import {useReportWorkTypeWorkersContext} from "../../../context/report-work-type-workers/report-work-type-workers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {ReportWorkTypeWorkersColumnsLayout} from "../columns/report-work-type-workers-columns.layout.jsx";

import ReportWorkTypeWorkersStoreLayout from "../store/report-work-type-workers-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";

import {format} from "date-fns";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const ReportWorkTypeWorkersTableLayout = ({reportWorkTypeId}) => {
    const {reportWorkType, reportWorkTypeWorkers, getReportWorkType, getReportWorkTypeWorkers, getWorkers} = useReportWorkTypeWorkersContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Ouvrier', 'Matricule',
        'Heures Normales', 'Heures Supplémentaires',
        'Temps Unitaire', 'Rondement',
        'Nombre ouvriers', 'Nombre H.N', 'Nombre H.S',
        'Saisie', 'Actions'
    ];

    const hiddenColumns = {};

    const loadData = async () => {
        setLoading(true);

        await getReportWorkType(reportWorkTypeId);

        await getReportWorkTypeWorkers(reportWorkTypeId);

        await getWorkers();

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        console.log(reportWorkType);
    }, [reportWorkType]);

    return (
        <>
            {
                loading
                    ? <LoadingComponent />
                    :
                    <div className="w-full">
                        <h2 className="pt-2 px-4 font-bold">
                            {reportWorkType.site_name} |
                            {reportWorkType.date ? format(new Date(reportWorkType.date), 'dd-MM-yyyy') : ""} |
                            {reportWorkType.work_type_name}
                        </h2>

                        <DataTableComponent
                            addBtn={permissions.includes("store report work type workers") &&  <ReportWorkTypeWorkersStoreLayout reportWorkTypeId={reportWorkTypeId}/>}
                            refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                            columns={ReportWorkTypeWorkersColumnsLayout()}
                            data={reportWorkTypeWorkers}
                            list={listVisibles}
                            hiddenColumns={hiddenColumns}
                        />
                    </div>
            }
        </>
    )
}

ReportWorkTypeWorkersTableLayout.propTypes = {
    reportWorkTypeId: PropTypes.string.isRequired,
};

export default ReportWorkTypeWorkersTableLayout;