import {axiosClient} from "../utilities/axios.js";

const AssignmentsApis = {
    getAssignments: async () => {
        return await axiosClient().get("assignments");
    },
    getAssignment: async id => {
        return await axiosClient().get(`assignments/${id}`);
    },
    create: async (payload) => {
        return await axiosClient().post("assignments", {...payload});
    },
    update: async (id, payload) => {
        return await axiosClient().patch(`assignments/${id}`, {...payload});
    },
    delete: async (id) => {
        return await axiosClient().delete(`assignments/${id}`);
    },
};

export default AssignmentsApis;