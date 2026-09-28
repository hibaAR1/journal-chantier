import {axiosClient} from "../utilities/axios.js";

const ProductsApis = {
    getProducts: async () => {
        return await axiosClient().get("products");
    },
    create: async (payload) => {
        return await axiosClient().post("products", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`products/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`products/${id}`);
    },
};

export default ProductsApis;