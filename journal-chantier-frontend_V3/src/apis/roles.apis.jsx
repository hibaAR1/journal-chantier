import { axiosClient } from "../utilities/axios.js";

const RolesApis = {
    getRoles: async () => {
        return await axiosClient().get("roles");
    },
    create: async (payload) => {
        return await axiosClient().post("roles", { ...payload });
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`roles/${id}`, { ...payload });
    },
    delete: async (id) => {
        return await axiosClient().delete(`roles/${id}`);
    },
};

export default RolesApis;
