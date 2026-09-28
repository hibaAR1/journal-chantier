import {axiosClient} from "../utilities/axios.js";

const SitesApis = {
    getSites: async () => {
        return await axiosClient().get("sites");
    },
    getSite: async (id) => {
        return await axiosClient().get(`sites/${id}`);
    },
    create: async (payload) => {
        return await axiosClient().post("sites", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`sites/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`sites/${id}`);
    },
};

export default SitesApis;