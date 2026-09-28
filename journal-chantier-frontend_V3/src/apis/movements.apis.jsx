import {axiosClient} from "../utilities/axios.js";

const MovementsApis = {
    getMovements: async () => {
        return await axiosClient().get("movements");
    },
    create: async (payload) => {
        return await axiosClient().post("movements", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`movements/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`movements/${id}`);
    },
};

export default MovementsApis;