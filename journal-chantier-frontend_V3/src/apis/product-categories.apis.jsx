import {axiosClient} from "../utilities/axios.js";

const ProductCategoriesApis = {
    getProductCategories: async () => {
        return await axiosClient().get("product-categories");
    },
    create: async (payload) => {
        return await axiosClient().post("product-categories", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`product-categories/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`product-categories/${id}`);
    },
};

export default ProductCategoriesApis;