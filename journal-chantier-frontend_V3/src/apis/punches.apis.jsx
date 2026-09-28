import {axiosClient} from "../utilities/axios.js";

const PunchesApis = {
    getPunches: async () => {
        return await axiosClient().get("punches");
    },
    getPunch: async id => {
        return await axiosClient().get(`punches/${id}`);
    },
    create: async (payload) => {
        return await axiosClient().post("punches", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`punches/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`punches/${id}`);
    },
    validate: async (id) => {
        return await axiosClient().patch(`punches/${id}/validate`);
    },
    invalidate: async (id) => {
        return await axiosClient().patch(`punches/${id}/invalidate`);
    },
};

export default PunchesApis;