import { axiosClient } from "../utilities/axios.js";

const PermissionsApis = {
    getPermissions: async () => {
        return await axiosClient().get("permissions");
    },
    create: async (payload) => {
        return await axiosClient().post("permissions", { ...payload });
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`permissions/${id}`, { ...payload });
    },
    delete: async (id) => {
        return await axiosClient().delete(`permissions/${id}`);
    },
};

export default PermissionsApis;
