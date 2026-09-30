import { axiosClient } from "../utilities/axios.js";

const PunchDetailsApis = {
  // Export Pointage Détaillé (Excel) : params = { from, to (yyyy-MM-dd), site_ids (optionnel = tous) }
  exportExcel: async (params) => {
    return await axiosClient().get("punch-details/export", {
      params,
      responseType: "blob", // fichier binaire (.xlsx)
    });
  },
};

export default PunchDetailsApis;
