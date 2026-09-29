import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import { useDashboardContext } from "../../../context/dashboard/dashboard.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DashboardFiltersLayout from "../filters/dashboard-filters.layout.jsx";
import DashboardIndicatorsLayout from "../indicators/dashboard-indicators.layout.jsx";
import DashboardWorkforceChartLayout from "../workforce-chart/dashboard-workforce-chart.layout.jsx";
import DashboardTasksTableLayout from "../tasks-table/dashboard-tasks-table.layout.jsx";

/**
 * Tableau de bord journalier (cahier des charges V3 — § 2.2).
 * Filtres : chantier + date. L'utilisateur choisit lui-même le chantier.
 */
const DashboardDailyLayout = () => {
  const { daily, getDaily, sites, getSites, loading, error } =
    useDashboardContext();

  const [siteId, setSiteId] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    getSites();
  }, []);

  // Le backend renvoie la date retenue (dernier journal si aucune date choisie)
  useEffect(() => {
    if (daily) {
      setDate(daily.date ? parseISO(daily.date) : null);
    }
  }, [daily]);

  const handleSiteChange = (value) => {
    setSiteId(value);
    // Nouveau chantier → on affiche son dernier journal
    getDaily({ siteId: value });
  };

  const handleDateChange = (value) => {
    setDate(value);
    getDaily({ siteId, date: format(value, "yyyy-MM-dd") });
  };

  const title =
    siteId && daily?.site
      ? `${daily.site.name} — Journal du ${date ? format(date, "dd/MM/yyyy") : "…"}`
      : "Tableau de bord journalier";

  const renderBody = () => {
    if (sites.length === 0) {
      return (
        <p className="text-sm text-secondary-500">Aucun chantier disponible.</p>
      );
    }

    if (!siteId) {
      return (
        <p className="text-sm text-secondary-500">
          Sélectionnez un chantier pour afficher son tableau de bord.
        </p>
      );
    }

    if (loading) {
      return <LoadingComponent />;
    }

    if (error) {
      return <p className="text-sm text-red-700">{error}</p>;
    }

    if (!daily?.report) {
      return (
        <p className="text-sm text-secondary-500">
          Aucun journal saisi pour ce chantier à cette date.
        </p>
      );
    }

    return (
      <>
        <DashboardIndicatorsLayout indicators={daily.indicators} />

        <section>
          <h3 className="font-semibold text-lg mb-2">
            Effectif par catégorie de travaux
          </h3>
          <DashboardWorkforceChartLayout rows={daily.workforce_by_category} />
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">
            Rendement par tâche (les plus faibles en premier)
          </h3>
          <DashboardTasksTableLayout tasks={daily.tasks} />
        </section>
      </>
    );
  };

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-primary-100 pb-3">
        <h2 className="font-semibold text-xl">{title}</h2>

        <DashboardFiltersLayout
          sites={sites}
          siteId={siteId}
          date={date}
          onSiteChange={handleSiteChange}
          onDateChange={handleDateChange}
        />
      </div>

      {renderBody()}
    </div>
  );
};

export default DashboardDailyLayout;
