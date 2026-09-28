import {axiosClient} from "../utilities/axios.js";

const WorkersApis = {
    getWorkers: async () => {
        return await axiosClient().get("workers");
    },
    create: async (payload) => {
        return await axiosClient().post("workers", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`workers/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`workers/${id}`);
    },
    export: async () => {
        return await axiosClient().get(`worker/export`, {
            responseType: "blob",
        });
    },
    upload: async (payload) => {
        return await axiosClient().post("worker/import", payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    exportAll: async () => {
        return await axiosClient().get(
            "worker/export/all",
            {
                responseType: "blob",
            }
        );
    },
};

export default WorkersApis;