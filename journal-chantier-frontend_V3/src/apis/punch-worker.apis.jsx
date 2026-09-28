import {axiosClient} from "../utilities/axios.js";

const PunchWorkersApis = {
    getPunchWorkers: async (punchId) => {
        return await axiosClient().get(`punch-worker/${punchId}`);
    },
    create: async (payload) => {
        return await axiosClient().post("punch-worker", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`punch-worker/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`punch-worker/${id}`);
    },
    export: async (id) => {
        return await axiosClient().get(`punch-workers/export/${id}`, {
            responseType: "blob",
        });
    },
    upload: async (payload) => {
        return await axiosClient().post("punch-workers/import", payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    checkWorker: async (workerId, punchId) => {
        return await axiosClient().get(
            `/punch-workers/check?worker_id=${workerId}&punch_id=${punchId}`
        );
    }
};

export default PunchWorkersApis;