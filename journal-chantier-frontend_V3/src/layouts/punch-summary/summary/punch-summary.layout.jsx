import { useEffect, useState } from "react";
import { format } from "date-fns";

import PunchSummaryApis from "../../../apis/punch-summary.apis.jsx";
import SitesApis from "../../../apis/sites.apis.jsx";

import LoadingComponent from "../../../components/loading/loading.component.jsx";

import PunchSummaryFiltersLayout from "../filters/punch-summary-filters.layout.jsx";
import PunchSummaryTableLayout from "../table/punch-summary-table.layout.jsx";

/**
 * État Récapitulatif Journalier de Pointage (cahier des charges V3 — § 3.1.6).
 * Filtres : chantier (ou tous) + date. Par défaut : aujourd'hui, tous les chantiers.
 * Le tableau est recalculé par le backend à chaque chargement :
 * il reflète toujours la dernière version des pointages.
 */
const PunchSummaryLayout = () => {
  const [sites, setSites] = useState([]);
  const [siteId, setSiteId] = useState(null); // null = tous les chantiers
  const [date, setDate] = useState(new Date());

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async ({ newDate = date, newSiteId = siteId } = {}) => {
    setLoading(true);
    setError(null);

    await PunchSummaryApis.getSummary({
      date: format(newDate, "yyyy-MM-dd"),
      site_id: newSiteId || undefined,
    })
      .then(({ data }) => setSummary(data))
      .catch((err) => {
        setSummary(null);
        setError(
          err?.response?.status === 403
            ? "Vous n'avez pas le droit de consulter les pointages."
            : "Impossible de charger l'état récapitulatif.",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    SitesApis.getSites()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        setSites(list.map((site) => ({ value: site.id, label: site.name })));
      })
      .catch((err) => console.warn(err));

    load();
  }, []);

  const handleSiteChange = (value) => {
    setSiteId(value);
    load({ newSiteId: value });
  };

  const handleDateChange = (value) => {
    setDate(value);
    load({ newDate: value });
  };

  const renderBody = () => {
    if (loading) {
      return <LoadingComponent />;
    }

    if (error) {
      return <p className="text-sm text-red-700">{error}</p>;
    }

    if (!summary || summary.rows.length === 0) {
      return (
        <p className="text-sm text-secondary-500">
          Aucun pointage saisi pour cette date.
        </p>
      );
    }

    return <PunchSummaryTableLayout summary={summary} />;
  };

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-primary-100 pb-3">
        <h2 className="font-semibold text-xl">
          État Récapitulatif Journalier de Pointage du{" "}
          {format(date, "dd/MM/yyyy")}
        </h2>

        <PunchSummaryFiltersLayout
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

export default PunchSummaryLayout;
