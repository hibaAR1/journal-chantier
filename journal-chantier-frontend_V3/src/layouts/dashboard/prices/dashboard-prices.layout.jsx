import { useEffect, useState } from "react";
import { format } from "date-fns";

import { useDashboardContext } from "../../../context/dashboard/dashboard.context.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import DashboardPricesFiltersLayout from "../prices-filters/dashboard-prices-filters.layout.jsx";
import DashboardPricesTableLayout from "../prices-table/dashboard-prices-table.layout.jsx";

/**
 * Base de prix / étude des prix (cahier des charges V3 — § 2.5).
 * Filtres : catégorie de travaux + période historique. Par défaut : toutes les catégories, tout l'historique.
 */
const DashboardPricesLayout = () => {
  const { prices, getPrices, pricesLoading, pricesError } =
    useDashboardContext();

  const [workId, setWorkId] = useState(null);
  const [period, setPeriod] = useState(undefined);

  useEffect(() => {
    getPrices();
  }, []);

  const toFilters = (category, value) => ({
    workId: category,
    from: value?.from ? format(value.from, "yyyy-MM-dd") : undefined,
    to: value?.to ? format(value.to, "yyyy-MM-dd") : undefined,
  });

  const handleCategoryChange = (value) => {
    setWorkId(value);
    getPrices(toFilters(value, period));
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);

    // Période effacée (tout l'historique) ou complète (du … au …)
    if (!value || (value.from && value.to)) {
      getPrices(toFilters(workId, value));
    }
  };

  const renderBody = () => {
    if (pricesLoading) {
      return <LoadingComponent />;
    }

    if (pricesError) {
      return <p className="text-sm text-red-700">{pricesError}</p>;
    }

    return (
      <>
        <DashboardPricesTableLayout rows={prices?.rows ?? []} />

        <p className="text-xs text-secondary-500">
          TU moyen / min / max : calculés à partir des lignes de journal (heures
          ÷ quantité). TU réf. : valeur cible saisie dans Travaux → Tâches
          (champ « Temps unitaire référentiel »). Les lignes grisées sont des
          tâches du catalogue encore jamais saisies dans un journal.
        </p>
      </>
    );
  };

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-primary-100 pb-3">
        <h2 className="font-semibold text-xl">
          Référentiel des temps unitaires — catalogue complet de la plateforme
        </h2>

        <DashboardPricesFiltersLayout
          categories={prices?.categories ?? []}
          workId={workId}
          period={period}
          onCategoryChange={handleCategoryChange}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {renderBody()}
    </div>
  );
};

export default DashboardPricesLayout;
