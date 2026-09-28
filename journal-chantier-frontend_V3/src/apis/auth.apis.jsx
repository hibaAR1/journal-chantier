import {axiosClient} from "../utilities/axios.js";

const AuthApis = {
    login: async ({login, password}) => {
        return await axiosClient().post('login', {login, password});
    },
    logout: async () => {
        return await axiosClient().post('logout');
    },
    getUser: async () => {
        return await axiosClient().get("user");
    },
    changePassword: async (payload) => {
        return await axiosClient().post('change-password', payload);
    }
};

export default AuthApis;
