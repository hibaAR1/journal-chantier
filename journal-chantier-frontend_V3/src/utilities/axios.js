import axios from "axios";
import {getAccessToken} from "./access-token.js";

export const axiosClient = () => {
    axios.defaults.baseURL =  import.meta.env.VITE_BACKEND_URL + '/api';

    // if (getAccessToken()) {
    //     // Apply to every request
    //     return axios.create({
    //         baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
    //         headers: {
    //             'Authorization': `Bearer ${getAccessToken()}`,
    //             // 'Content-Type': 'multipart/form-data',
    //             // 'Accept': 'application/json',
    //         }
    //     });
    // } else {
    //     // Delete auth header
    //     return axios.create({
    //         baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
    //     });
    // }

    const client = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
        headers: getAccessToken()
            ? { 'Authorization': `Bearer ${getAccessToken()}` }
            : {}
    })

    // Interceptor for requests
    client.interceptors.request.use(request => {
        console.log('Starting Request', request);
        return request;
    }, error => {
        console.error('Request Error', error);
        return Promise.reject(error);
    });

    // Interceptor for responses
    client.interceptors.response.use(response => {
        console.log('Response:', response);
        return response;
    }, error => {
        console.error('Response Error:', error);
        return Promise.reject(error);
    });

    return client;
}
