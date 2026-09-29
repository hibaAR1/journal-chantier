import { useEffect } from "react";

import { usePunchesContext } from "../../../context/punches/punches.context.jsx";
import { useLoadingContext } from "../../../context/loading/loading.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";
import DataTableComponent from "../../../components/data-table/data-table.component.jsx";

import { PunchesColumnsLayout } from "../columns/punches-columns.layout.jsx";

import PunchesStoreLayout from "../store/punches-store.layout.jsx";

import TableRefreshBtnComponent from "../../../components/table/table-refresh-btn/table-refresh-btn.component.jsx";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";

const PunchesTableLayout = () => {
  const { punches, getPunches, getSites } = usePunchesContext();

  const { loading, setLoading } = useLoadingContext();

  const { user } = useAuthContext();

  const permissions = user?.permissions || [];

  const listVisibles = ["Code", "Chantier", "Date", "Saisie", "Actions"];

  const hiddenColumns = {};

  const loadData = async () => {
    setLoading(true);

    await getPunches();

    await getSites();

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const sanitizedPunches = (punches || []).filter(
    (p) =>
      p &&
      typeof p === "object" &&
      Object.prototype.hasOwnProperty.call(p, "date"),
  );

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <DataTableComponent
          addBtn={
            permissions.includes("store punches") && <PunchesStoreLayout />
          }
          refreshBtn={<TableRefreshBtnComponent onClick={loadData} />}
          columns={PunchesColumnsLayout()}
          data={sanitizedPunches}
          list={listVisibles}
          hiddenColumns={hiddenColumns}
        />
      )}
    </>
  );
};

export default PunchesTableLayout;
