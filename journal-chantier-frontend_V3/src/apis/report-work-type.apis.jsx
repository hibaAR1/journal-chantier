import {axiosClient} from "../utilities/axios.js";

const ReportWorkTypeApis = {
    getReportWorkTypes: async (reportId) => {
        const response = await axiosClient().get(`report-work-type/${reportId}`);
        return response.data; // pas response.data.reportWorkTypes
    },

    getReportWorkType: async (id) => {
        return await axiosClient().get(`report-work-type/show/${id}`);
    },
    create: async (payload) => {
        return await axiosClient().post("report-work-type", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`report-work-type/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`report-work-type/${id}`);
    },

    reinstate: async (id, todayReportId, payload) => {
        return await axiosClient().patch(`report-work-type/${id}/reinstate`,  {
            report_id: todayReportId,
            ...payload
        });
    },
};

export default ReportWorkTypeApis;