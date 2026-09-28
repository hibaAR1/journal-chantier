import {axiosClient} from "../utilities/axios.js";

const WorkTypesApis = {
    getWorkTypes: async () => {
        return await axiosClient().get("work-types");
    },
    create: async (payload) => {
        return await axiosClient().post("work-types", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`work-types/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`work-types/${id}`);
    },
};

export default WorkTypesApis;