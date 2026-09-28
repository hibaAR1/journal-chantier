import {axiosClient} from "../utilities/axios.js";

const SiteLocationApis = {
    getSiteLocations: async (siteId) => {
        return await axiosClient().get(`site-locations/${siteId}`);
    },
    getSiteLocation: async (id) => {
        return await axiosClient().get(`site-locations/show/${id}`);
    },
    create: async (payload) => {
        return await axiosClient().post("site-locations", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`site-locations/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`site-locations/${id}`);
    },
};

export default SiteLocationApis;