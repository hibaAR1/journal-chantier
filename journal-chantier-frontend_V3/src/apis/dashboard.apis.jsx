import { axiosClient } from "../utilities/axios.js";

const DashboardApis = {
  // Tableau de bord journalier : params = { site_id, date (yyyy-MM-dd, optionnelle) }
  getDaily: async (params) => {
    return await axiosClient().get("dashboard/daily", { params });
  },
  // Suivi historique : params = { site_id, from, to (yyyy-MM-dd, optionnelles) }
  getHistory: async (params) => {
    return await axiosClient().get("dashboard/history", { params });
  },
  // Comparatif multi-chantiers : params = { from, to, work_type_id (optionnels) }
  getComparison: async (params) => {
    return await axiosClient().get("dashboard/comparison", { params });
  },
  // Base de prix : params = { work_id, from, to (optionnels) }
  getPrices: async (params) => {
    return await axiosClient().get("dashboard/prices", { params });
  },
};

export default DashboardApis;
