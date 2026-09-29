import { useEffect, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";

import { useDashboardContext } from "../../../context/dashboard/dashboard.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DashboardComparisonFiltersLayout from "../comparison-filters/dashboard-comparison-filters.layout.jsx";
import DashboardSitesHoursLayout from "../sites-hours/dashboard-sites-hours.layout.jsx";
import DashboardSitesHoursChartLayout from "../sites-hours-chart/dashboard-sites-hours-chart.layout.jsx";
import DashboardTaskSelectLayout from "../task-select/dashboard-task-select.layout.jsx";
import DashboardTaskComparisonLayout from "../task-comparison/dashboard-task-comparison.layout.jsx";
import DashboardMultiTasksLayout from "../multi-tasks/dashboard-multi-tasks.layout.jsx";

/**
 * Période réelle (du … au …) selon le type choisi dans "Période : Jour ▾".
 * Semaine = du lundi au dimanche ; Mois = du 1er au dernier jour du mois.
 */
const computePeriod = (type, date, range) => {
  if (type === "custom") return range;
  if (!date) return undefined;
  if (type === "week") {
    return {
      from: startOfWeek(date, { weekStartsOn: 1 }),
      to: endOfWeek(date, { weekStartsOn: 1 }),
    };
  }
  if (type === "month") {
    return { from: startOfMonth(date), to: endOfMonth(date) };
  }
  return { from: date, to: date };
};

/**
 * Texte de la période pour le titre :
 * "Journée du 07/07/2026", "Semaine du 06/07 au 12/07/2026", "Mois de juillet 2026", "Du … au …".
 */
const describePeriod = (type, period) => {
  if (!period?.from) return "Sélectionner une période";

  const from = format(period.from, "dd/MM/yyyy");
  const to = format(period.to ?? period.from, "dd/MM/yyyy");

  if (type === "day") return `Journée du ${from}`;
  if (type === "week")
    return `Semaine du ${format(period.from, "dd/MM")} au ${to}`;
  if (type === "month")
    return `Mois de ${format(period.from, "MMMM yyyy", { locale: fr })}`;
  return from === to ? `Journée du ${from}` : `Du ${from} au ${to}`;
};

/**
 * Comparatif multi-chantiers (cahier des charges V3 — § 2.4).
 * Filtres : "Période : Jour ▾" (+ date) et "N chantiers actifs ▾" ; sélecteur "Tâche ▾" à côté du diagramme.
 * Par défaut : la journée du dernier journal saisi, tous les chantiers actifs.
 */
const DashboardComparisonLayout = () => {
  const { comparison, getComparison, comparisonLoading, comparisonError } =
    useDashboardContext();

  const [periodType, setPeriodType] = useState("day");
  const [date, setDate] = useState(undefined); // jour choisi (Jour / Semaine / Mois)
  const [range, setRange] = useState(undefined); // du … au … (Personnalisée)
  const [siteIds, setSiteIds] = useState([]); // vide = tous les chantiers actifs

  const period = computePeriod(periodType, date, range);

  // Premier chargement : dernière journée saisie, tous chantiers
  useEffect(() => {
    getComparison();
  }, []);

  // Au premier chargement, le backend renvoie la journée retenue
  useEffect(() => {
    if (!date && comparison?.from) {
      setDate(parseISO(comparison.from));
    }
  }, [comparison]);

  const load = ({
    newPeriod = period,
    workTypeId = comparison?.task_comparison?.work_type_id,
    newSiteIds = siteIds,
  } = {}) => {
    if (!newPeriod?.from || !newPeriod?.to) return;

    getComparison({
      from: format(newPeriod.from, "yyyy-MM-dd"),
      to: format(newPeriod.to, "yyyy-MM-dd"),
      workTypeId,
      siteIds: newSiteIds,
    });
  };

  const handlePeriodTypeChange = (type) => {
    // On garde le jour choisi et on recalcule la période autour de lui (semaine, mois…)
    const anchor = periodType === "custom" ? (range?.from ?? date) : date;

    setPeriodType(type);

    if (type === "custom") {
      // On part de la période affichée (ex. la semaine en cours) pour la personnaliser
      const current =
        period?.from && period?.to ? period : computePeriod("day", anchor);
      setRange(current);
      load({ newPeriod: current });
    } else {
      setDate(anchor);
      load({ newPeriod: computePeriod(type, anchor) });
    }
  };

  const handleDateChange = (value) => {
    setDate(value);
    load({ newPeriod: computePeriod(periodType, value) });
  };

  const handleRangeChange = (value) => {
    setRange(value);
    // On attend que les deux dates soient choisies
    load({ newPeriod: value });
  };

  const handleSitesChange = (ids) => {
    setSiteIds(ids);
    load({ newSiteIds: ids });
  };

  const handleTaskChange = (workTypeId) => {
    load({ workTypeId });
  };

  const comparedSites = comparison?.sites?.length ?? 0;
  const periodText = describePeriod(periodType, period);

  const renderBody = () => {
    if (comparisonLoading) {
      return <LoadingComponent />;
    }

    if (comparisonError) {
      return <p className="text-sm text-red-700">{comparisonError}</p>;
    }

    if (!comparison || comparedSites === 0) {
      return (
        <p className="text-sm text-secondary-500">
          Aucun journal saisi sur cette période pour les chantiers choisis.
        </p>
      );
    }

    return (
      <>
        {/* Tableau "Heures totales / H.N / H.S / Effectif / % H.S" */}
        <DashboardSitesHoursLayout rows={comparison.sites_hours} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section>
            <h3 className="font-semibold text-lg mb-2">
              Heures totales par chantier — H.N vs H.S
            </h3>
            <DashboardSitesHoursChartLayout rows={comparison.sites_hours} />
          </section>

          <section>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">
                Comparaison d&apos;une tâche
              </h3>
              <DashboardTaskSelectLayout
                tasks={comparison.tasks ?? []}
                workTypeId={comparison.task_comparison?.work_type_id}
                onTaskChange={handleTaskChange}
              />
            </div>
            <DashboardTaskComparisonLayout
              comparison={comparison.task_comparison}
            />
          </section>
        </div>

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
          Comparatif{period?.from ? ` — ${periodText}` : " multi-chantiers"}
        </h2>

        <DashboardComparisonFiltersLayout
          periodType={periodType}
          period={period}
          activeSites={comparison?.active_sites ?? []}
          selectedSiteIds={siteIds}
          onPeriodTypeChange={handlePeriodTypeChange}
          onDateChange={handleDateChange}
          onRangeChange={handleRangeChange}
          onSitesChange={handleSitesChange}
        />
      </div>

      {renderBody()}
    </div>
  );
};

export default DashboardComparisonLayout;
