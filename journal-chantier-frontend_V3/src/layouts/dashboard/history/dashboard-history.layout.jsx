import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import { useDashboardContext } from "../../../context/dashboard/dashboard.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DashboardHistoryFiltersLayout from "../history-filters/dashboard-history-filters.layout.jsx";
import DashboardUnitChartsLayout from "../unit-charts/dashboard-unit-charts.layout.jsx";
import DashboardHoursChartLayout from "../hours-chart/dashboard-hours-chart.layout.jsx";
import DashboardTaskTotalsLayout from "../task-totals/dashboard-task-totals.layout.jsx";

/**
 * Suivi historique d'un chantier (cahier des charges V3 — § 2.3).
 * Filtres : chantier + période. Par défaut : les 7 derniers jours jusqu'au dernier journal.
 */
const DashboardHistoryLayout = () => {
  const { sites, getSites, history, getHistory, historyLoading, historyError } =
    useDashboardContext();

  const [siteId, setSiteId] = useState(null);
  const [period, setPeriod] = useState(undefined);

  useEffect(() => {
    if (sites.length === 0) {
      getSites();
    }
  }, []);

  // Le backend renvoie la période retenue (7 derniers jours si aucune période choisie)
  useEffect(() => {
    if (history?.from && history?.to) {
      setPeriod({ from: parseISO(history.from), to: parseISO(history.to) });
    }
  }, [history]);

  const handleSiteChange = (value) => {
    setSiteId(value);
    getHistory({ siteId: value });
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);

    // On attend que les deux dates (du … au …) soient choisies
    if (siteId && value?.from && value?.to) {
      getHistory({
        siteId,
        from: format(value.from, "yyyy-MM-dd"),
        to: format(value.to, "yyyy-MM-dd"),
      });
    }
  };

  const title =
    siteId && history?.site
      ? `${history.site.name} — Historique`
      : "Suivi historique d'un chantier";

  const renderBody = () => {
    if (sites.length === 0) {
      return (
        <p className="text-sm text-secondary-500">Aucun chantier disponible.</p>
      );
    }

    if (!siteId) {
      return (
        <p className="text-sm text-secondary-500">
          Sélectionnez un chantier pour afficher son historique.
        </p>
      );
    }

    if (historyLoading) {
      return <LoadingComponent />;
    }

    if (historyError) {
      return <p className="text-sm text-red-700">{historyError}</p>;
    }

    if (!history || history.days.length === 0) {
      return (
        <p className="text-sm text-secondary-500">
          Aucun journal saisi pour ce chantier sur cette période.
        </p>
      );
    }

    return (
      <>
        <section>
          <h3 className="font-semibold text-lg mb-2">
            Quantité réalisée par jour, par unité
          </h3>
          <DashboardUnitChartsLayout
            days={history.days}
            series={history.quantity_by_unit}
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section>
            <h3 className="font-semibold text-lg mb-2">
              Heures normales vs heures sup. par jour
            </h3>
            <DashboardHoursChartLayout rows={history.hours_by_day} />
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">
              Quantité totale par tâche (période)
            </h3>
            <DashboardTaskTotalsLayout rows={history.quantity_by_task} />
          </section>
        </div>
      </>
    );
  };

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-primary-100 pb-3">
        <h2 className="font-semibold text-xl">{title}</h2>

        <DashboardHistoryFiltersLayout
          sites={sites}
          siteId={siteId}
          period={period}
          onSiteChange={handleSiteChange}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {renderBody()}
    </div>
  );
};

export default DashboardHistoryLayout;
