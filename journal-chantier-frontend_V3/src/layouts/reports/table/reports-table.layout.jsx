import {useEffect} from "react";

import {useReportsContext} from "../../../context/reports/reports.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import {ReportsColumnsLayout} from "../columns/reports-columns.layout.jsx";

import ReportsStoreLayout from "../store/reports-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const ReportsTableLayout = () => {
    const {reports, getReports, getSites} = useReportsContext();

    const {loading, setLoading} = useLoadingContext();

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const listVisibles = [
        'Code', 'Chantier', 'Date', 'Observations', 'Saisie', 'Actions'
    ];

    const hiddenColumns = {
        'observations': false,
    };

    const loadData = async () => {
        setLoading(true);

        await getReports();

        await getSites();

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    const sanitizeReports = (reports || []).filter(
        (r) => r && typeof r === "object" && Object.prototype.hasOwnProperty.call(r, "date")
    );

    return (
        <>
            {
                loading
                    ? <LoadingComponent />
                    :
                    <DataTableComponent
                        addBtn={permissions.includes("store reports") && <ReportsStoreLayout />}
                        refreshBtn={<TableRefreshBtnComponent onClick={loadData}/>}
                        columns={ReportsColumnsLayout()}
                        data={sanitizeReports}
                        list={listVisibles}
                        hiddenColumns={hiddenColumns}
                    />
            }
        </>
    )
}

export default ReportsTableLayout;
