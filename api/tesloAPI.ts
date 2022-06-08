import axios from 'axios';

export const tesloAPI = axios.create({
    baseURL: '/api'
});

export default tesloAPI;