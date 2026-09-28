import {axiosClient} from "../utilities/axios.js";

const AssignmentWorkersApis = {
    getAssignmentWorkers: async (assignmentId) => {
        return await axiosClient().get(`assignment-worker/${assignmentId}`);
    },
    create: async (payload) => {
        return await axiosClient().post("assignment-worker", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`assignment-worker/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`assignment-worker/${id}`);
    },
    export: async (id) => {
        return await axiosClient().get(`assignment-workers/export/${id}`, {
            responseType: "blob",
        });
    },
    upload: async (payload) => {
        return await axiosClient().post("assignment-workers/import", payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }
};

export default AssignmentWorkersApis;