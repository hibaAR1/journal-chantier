import { useEffect, useState } from "react";
import { format, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";

import { useDashboardContext } from "../../../context/dashboard/dashboard.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DashboardHistoryFiltersLayout from "../history-filters/dashboard-history-filters.layout.jsx";
import DashboardUnitChartsLayout from "../unit-charts/dashboard-unit-charts.layout.jsx";
import DashboardHoursChartLayout from "../hours-chart/dashboard-hours-chart.layout.jsx";
import DashboardTaskTotalsLayout from "../task-totals/dashboard-task-totals.layout.jsx";

// Titres des diagrammes selon "Période : Jour ▾"
const GROUP_WORDS = { day: "jour", week: "semaine", month: "mois" };

/**
 * Regroupe les données jour par jour en semaines (du lundi) ou en mois.
 * Par défaut ("day") : un point par jour, comme renvoyé par le backend.
 */
const groupHistory = (history, groupBy) => {
  const keyOf = (day) => {
    const date = parseISO(day);
    if (groupBy === "week")
      return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    if (groupBy === "month") return format(startOfMonth(date), "yyyy-MM");
    return day;
  };

  const labelOf = (key) => {
    if (groupBy === "week") return `Sem. du ${format(parseISO(key), "dd/MM")}`;
    if (groupBy === "month")
      return format(parseISO(`${key}-01`), "MMM yyyy", { locale: fr });
    return format(parseISO(key), "dd/MM");
  };

  // Liste des jours / semaines / mois, dans l'ordre
  const keys = [...new Set(history.days.map(keyOf))];
  const indexOfDay = history.days.map((day) => keys.indexOf(keyOf(day)));

  // Additionne les valeurs des jours d'une même semaine / d'un même mois (arrondi pour l'affichage)
  const sumBy = (values) => {
    const totals = keys.map(() => 0);
    values.forEach((value, i) => {
      totals[indexOfDay[i]] += Number(value) || 0;
    });
    return totals.map((total) => Math.round(total * 100) / 100);
  };

  return {
    labels: keys.map(labelOf),
    series: history.quantity_by_unit.map((serie) => ({
      ...serie,
      values: sumBy(serie.values),
    })),
    hours: (() => {
      const normal = sumBy(history.hours_by_day.map((row) => row.normal_hours));
      const overtime = sumBy(
        history.hours_by_day.map((row) => row.overtime_hours),
      );
      return keys.map((key, i) => ({
        label: labelOf(key),
        normal_hours: normal[i],
        overtime_hours: overtime[i],
      }));
    })(),
  };
};

/**
 * Suivi historique d'un chantier (cahier des charges V3 — § 2.3).
 * Filtres : chantier + "Période : Jour ▾" (jour par défaut) + plage de dates.
 * Par défaut : les 7 derniers jours jusqu'au dernier journal.
 */
const DashboardHistoryLayout = () => {
  const { sites, getSites, history, getHistory, historyLoading, historyError } =
    useDashboardContext();

  const [siteId, setSiteId] = useState(null);
  const [period, setPeriod] = useState(undefined);
  const [groupBy, setGroupBy] = useState("day"); // "Période : Jour ▾"

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

    const grouped = groupHistory(history, groupBy);
    const word = GROUP_WORDS[groupBy];

    return (
      <>
        <section>
          <h3 className="font-semibold text-lg mb-2">
            Quantité réalisée par {word}, par unité
          </h3>
          <DashboardUnitChartsLayout
            labels={grouped.labels}
            series={grouped.series}
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section>
            <h3 className="font-semibold text-lg mb-2">
              Heures normales vs heures sup. par {word}
            </h3>
            <DashboardHoursChartLayout rows={grouped.hours} />
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
          groupBy={groupBy}
          onSiteChange={handleSiteChange}
          onGroupByChange={setGroupBy}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {renderBody()}
    </div>
  );
};

export default DashboardHistoryLayout;
