import {axiosClient} from "../utilities/axios.js";

const ResourcesApis = {
    getResources: async () => {
        return await axiosClient().get("resources");
    },
    create: async (payload) => {
        return await axiosClient().post("resources", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`resources/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`resources/${id}`);
    },
};

export default ResourcesApis;