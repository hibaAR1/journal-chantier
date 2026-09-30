import { axiosClient } from "../utilities/axios.js";

const PunchSummaryApis = {
  // État récapitulatif journalier : params = { date (yyyy-MM-dd), site_id (optionnel = tous les chantiers) }
  getSummary: async (params) => {
    return await axiosClient().get("punch-summary", { params });
  },
};

export default PunchSummaryApis;
