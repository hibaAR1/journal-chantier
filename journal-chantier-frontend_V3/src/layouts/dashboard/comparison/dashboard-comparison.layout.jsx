import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import { useDashboardContext } from "../../../context/dashboard/dashboard.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DashboardComparisonFiltersLayout from "../comparison-filters/dashboard-comparison-filters.layout.jsx";
import DashboardSitesHoursLayout from "../sites-hours/dashboard-sites-hours.layout.jsx";
import DashboardTaskComparisonLayout from "../task-comparison/dashboard-task-comparison.layout.jsx";
import DashboardMultiTasksLayout from "../multi-tasks/dashboard-multi-tasks.layout.jsx";

/**
 * Comparatif multi-chantiers (cahier des charges V3 — § 2.4).
 * Filtres : période + tâche. Par défaut : la journée du dernier journal saisi.
 */
const DashboardComparisonLayout = () => {
  const { comparison, getComparison, comparisonLoading, comparisonError } =
    useDashboardContext();

  const [period, setPeriod] = useState(undefined);

  // Premier chargement : dernière journée saisie, tous chantiers
  useEffect(() => {
    getComparison();
  }, []);

  // Le backend renvoie la période retenue
  useEffect(() => {
    if (comparison?.from && comparison?.to) {
      setPeriod({
        from: parseISO(comparison.from),
        to: parseISO(comparison.to),
      });
    }
  }, [comparison]);

  const toFilters = (value, workTypeId) => ({
    from: value?.from ? format(value.from, "yyyy-MM-dd") : undefined,
    to: value?.to ? format(value.to, "yyyy-MM-dd") : undefined,
    workTypeId,
  });

  const handlePeriodChange = (value) => {
    setPeriod(value);

    // On attend que les deux dates soient choisies (un clic 2 fois sur le même jour = une journée)
    if (value?.from && value?.to) {
      getComparison(
        toFilters(value, comparison?.task_comparison?.work_type_id),
      );
    }
  };

  const handleTaskChange = (workTypeId) => {
    getComparison(toFilters(period, workTypeId));
  };

  const activeSites = comparison?.sites?.length ?? 0;

  // Titre comme dans le cahier des charges : "Comparatif — Journée du 07/07/2026"
  const periodTitle = !period?.from
    ? ""
    : !period.to ||
        format(period.from, "yyyy-MM-dd") === format(period.to, "yyyy-MM-dd")
      ? `Journée du ${format(period.from, "dd/MM/yyyy")}`
      : `Du ${format(period.from, "dd/MM/yyyy")} au ${format(period.to, "dd/MM/yyyy")}`;

  const renderBody = () => {
    if (comparisonLoading) {
      return <LoadingComponent />;
    }

    if (comparisonError) {
      return <p className="text-sm text-red-700">{comparisonError}</p>;
    }

    if (!comparison || activeSites === 0) {
      return (
        <p className="text-sm text-secondary-500">
          Aucun journal saisi sur cette période.
        </p>
      );
    }

    const taskTitle = comparison.task_comparison?.task
      ? ` — ${comparison.task_comparison.task} (${comparison.task_comparison.unit ?? "–"})`
      : "";

    return (
      <>
        <section>
          <h3 className="font-semibold text-lg mb-2">
            Heures totales par chantier — H.N vs H.S
          </h3>
          <DashboardSitesHoursLayout rows={comparison.sites_hours} />
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">
            Comparaison d&apos;une tâche{taskTitle}
          </h3>
          <DashboardTaskComparisonLayout
            comparison={comparison.task_comparison}
          />
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">
            Comparaison multi-tâches (temps unitaire réel, h/unité)
          </h3>
          <DashboardMultiTasksLayout
            sites={comparison.sites}
            rows={comparison.multi_tasks}
          />
        </section>
      </>
    );
  };

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-primary-100 pb-3">
        <h2 className="font-semibold text-xl">
          Comparatif{periodTitle ? ` — ${periodTitle}` : " multi-chantiers"}
          {activeSites > 0 && (
            <span className="ml-2 text-sm font-normal text-secondary-500">
              ({activeSites} chantier{activeSites > 1 ? "s" : ""} actif
              {activeSites > 1 ? "s" : ""})
            </span>
          )}
        </h2>

        <DashboardComparisonFiltersLayout
          period={period}
          tasks={comparison?.tasks ?? []}
          workTypeId={comparison?.task_comparison?.work_type_id}
          onPeriodChange={handlePeriodChange}
          onTaskChange={handleTaskChange}
        />
      </div>

      {renderBody()}
    </div>
  );
};

export default DashboardComparisonLayout;
