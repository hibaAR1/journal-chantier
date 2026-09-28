import {axiosClient} from "../utilities/axios.js";

const ClientsApis = {
    getClients: async () => {
        return await axiosClient().get("clients");
    },
    create: async (payload) => {
        return await axiosClient().post("clients", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`clients/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`clients/${id}`);
    },
};

export default ClientsApis;