import { createContext, useContext, useState } from "react";

import DashboardApis from "../../apis/dashboard.apis.jsx";
import SitesApis from "../../apis/sites.apis.jsx";

const DashboardContext = createContext({
  sites: [],
  getSites: () => {},
  // Onglet "Journalier" (§ 2.2)
  daily: null,
  getDaily: () => {},
  loading: false,
  error: null,
  // Onglet "Historique" (§ 2.3)
  history: null,
  getHistory: () => {},
  historyLoading: false,
  historyError: null,
  // Onglet "Multi-chantiers" (§ 2.4)
  comparison: null,
  getComparison: () => {},
  comparisonLoading: false,
  comparisonError: null,
  // Onglet "Base de prix" (§ 2.5)
  prices: null,
  getPrices: () => {},
  pricesLoading: false,
  pricesError: null,
});

// Messages d'erreur en français (le backend renvoie ses messages en anglais)
const errorMessage = (response) => {
  if (response?.status === 403)
    return "Vous n'avez pas accès à ce chantier ou à ce tableau de bord.";
  if (response?.status === 422)
    return "Filtres invalides : vérifiez les dates choisies.";
  if (!response)
    return "Serveur injoignable : vérifiez que le backend est démarré.";
  return "Impossible de charger le tableau de bord.";
};

export const DashboardProvider = ({ children }) => {
  const [sites, setSites] = useState([]);

  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);

  const [prices, setPrices] = useState(null);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState(null);

  const getSites = async () => {
    await SitesApis.getSites()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data?.data ?? []);

        setSites(
          list.map((site) => ({
            value: site.id,
            label: site.name,
          })),
        );
      })
      .catch((error) => console.warn(error));
  };

  // filters = { siteId, date } — date au format "yyyy-MM-dd" (optionnelle)
  const getDaily = async ({ siteId, date }) => {
    if (!siteId) return;

    setLoading(true);
    setError(null);

    await DashboardApis.getDaily({ site_id: siteId, date: date || undefined })
      .then(({ data }) => setDaily(data))
      .catch(({ response }) => {
        setDaily(null);
        setError(errorMessage(response));
      });

    setLoading(false);
  };

  // filters = { siteId, from, to } — dates au format "yyyy-MM-dd" (optionnelles)
  const getHistory = async ({ siteId, from, to }) => {
    if (!siteId) return;

    setHistoryLoading(true);
    setHistoryError(null);

    await DashboardApis.getHistory({
      site_id: siteId,
      from: from || undefined,
      to: to || undefined,
    })
      .then(({ data }) => setHistory(data))
      .catch(({ response }) => {
        setHistory(null);
        setHistoryError(errorMessage(response));
      });

    setHistoryLoading(false);
  };

  // filters = { from, to, workTypeId } — dates au format "yyyy-MM-dd" (optionnelles)
  // siteIds = chantiers choisis dans le sélecteur (vide = tous les chantiers actifs)
  const getComparison = async ({ from, to, workTypeId, siteIds } = {}) => {
    setComparisonLoading(true);
    setComparisonError(null);

    await DashboardApis.getComparison({
      from: from || undefined,
      to: to || undefined,
      work_type_id: workTypeId || undefined,
      site_ids: siteIds?.length ? siteIds : undefined,
    })
      .then(({ data }) => setComparison(data))
      .catch(({ response }) => {
        setComparison(null);
        setComparisonError(errorMessage(response));
      });

    setComparisonLoading(false);
  };

  // filters = { workId, from, to } — dates au format "yyyy-MM-dd" (optionnelles)
  const getPrices = async ({ workId, from, to } = {}) => {
    setPricesLoading(true);
    setPricesError(null);

    await DashboardApis.getPrices({
      work_id: workId || undefined,
      from: from || undefined,
      to: to || undefined,
    })
      .then(({ data }) => setPrices(data))
      .catch(({ response }) => {
        setPrices(null);
        setPricesError(errorMessage(response));
      });

    setPricesLoading(false);
  };

  return (
    <DashboardContext.Provider
      value={{
        sites,
        getSites,
        daily,
        getDaily,
        loading,
        error,
        history,
        getHistory,
        historyLoading,
        historyError,
        comparison,
        getComparison,
        comparisonLoading,
        comparisonError,
        prices,
        getPrices,
        pricesLoading,
        pricesError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
