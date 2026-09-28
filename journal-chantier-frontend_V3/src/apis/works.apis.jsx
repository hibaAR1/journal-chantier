import {axiosClient} from "../utilities/axios.js";

const WorksApis = {
    getWorks: async () => {
        return await axiosClient().get("works");
    },
    create: async (payload) => {
        return await axiosClient().post("works", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`works/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`works/${id}`);
    },
};

export default WorksApis;