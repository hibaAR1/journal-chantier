import {axiosClient} from "../utilities/axios.js";

const UsersApis = {
    getUsers: async () => {
        return await axiosClient().get("users");
    },
    getUser: async (id) => {
        return await axiosClient().get(`users/${id}`);
    },
    create: async (payload) => {
        return await axiosClient().post("users", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`users/${id}`, {...payload});
    },
    setIsActive: async (id) => {
        return await axiosClient().post(`users/${id}/set-is-active`);
    },
    resetPassword: async (id) => {
        return await axiosClient().post(`users/${id}/reset-password`);
    },
};

export default UsersApis;