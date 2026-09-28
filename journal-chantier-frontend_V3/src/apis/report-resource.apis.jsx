import {axiosClient} from "../utilities/axios.js";

const ReportResourceApis = {
    getReportResources: async (reportId) => {
        return await axiosClient().get(`report-resource/${reportId}`);
    },
    create: async (payload) => {
        return await axiosClient().post("report-resource", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`report-resource/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`report-resource/${id}`);
    },
};

export default ReportResourceApis;