import {axiosClient} from "../utilities/axios.js";

const ReportWorkTypeWorkerApis = {
    getReportWorkTypeWorkers: async (reportWorkTypeId) => {
        return await axiosClient().get(`report-work-type-worker/${reportWorkTypeId}`);
    },
    create: async (payload) => {
        return await axiosClient().post("report-work-type-worker", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`report-work-type-worker/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`report-work-type-worker/${id}`);
    },
    checkReportWorkTypeWorker: async (workerId, punchId) => {
         return await axiosClient().get(
             `/report-work-type-worker/check?worker_id=${workerId}&report_id=${punchId}`
         );
    }
};

export default ReportWorkTypeWorkerApis;