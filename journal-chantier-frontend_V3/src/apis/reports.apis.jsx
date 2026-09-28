import {axiosClient} from "../utilities/axios.js";

const ReportsApis = {
    getReports: async () => {
        return await axiosClient().get("reports");
    },
    getReport: async id => {
        return await axiosClient().get(`reports/${id}`);
    },
    create: async (payload) => {
        return await axiosClient().post("reports", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`reports/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`reports/${id}`);
    },
    validate: async (id) => {
        return await axiosClient().patch(`reports/${id}/validate`);
    },
    invalidate: async (id) => {
        return await axiosClient().patch(`reports/${id}/invalidate`);
    },
    downloadPDF: async (id) => {
        const response = await axiosClient().get(`reports/${id}/download`, {
            responseType: 'blob', // important pour fichiers binaires
        });
        return response.data;
    },

    downloadExcel: async (id) => {
        const response = await axiosClient().get(`reports/${id}/download-excel`, {
            responseType: 'blob',
        });
        return response.data;
    }
};

export default ReportsApis;