import {axiosClient} from "../utilities/axios.js";

const LocationsApis = {
    getLocations: async () => {
        return await axiosClient().get("locations");
    },
    create: async (payload) => {
        return await axiosClient().post("locations", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`locations/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`locations/${id}`);
    },
};

export default LocationsApis;