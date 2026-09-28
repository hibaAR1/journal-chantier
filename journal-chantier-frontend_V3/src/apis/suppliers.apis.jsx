import {axiosClient} from "../utilities/axios.js";

const SuppliersApis = {
    getSuppliers: async () => {
        return await axiosClient().get("suppliers");
    },
    create: async (payload) => {
        return await axiosClient().post("suppliers", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`suppliers/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`suppliers/${id}`);
    },
};

export default SuppliersApis;