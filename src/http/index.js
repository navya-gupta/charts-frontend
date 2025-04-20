// http/index.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true
});


export const uploadCSV = (formData) => api.post('/upload-csv', formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

export const getMasterCurveForAllTemperatures = (aUpperBound = 500, dUpperBound = 500) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uploadIdFromUrl = urlParams.get('upload_id');
    const uploadId = uploadIdFromUrl;
    if (!uploadId) throw new Error('No upload_id available');
    return api.get(`/get-master-curve-for-all-temperatures?upload_id=${uploadId}&a_upper_bound=${aUpperBound}&d_upper_bound=${dUpperBound}`);
};

export const getModulusVsStrainRateVsTemperature = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uploadIdFromUrl = urlParams.get('upload_id');
    const uploadId = uploadIdFromUrl; if (!uploadId) throw new Error('No upload_id available');
    return api.get(`/get-graph-data?upload_id=${uploadId}`);
};

export const getShearModulusVsFrequency = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uploadIdFromUrl = urlParams.get('upload_id');
    const uploadId = uploadIdFromUrl; console.log(uploadId);
    if (!uploadId) throw new Error('No upload_id available');
    return api.get(`/get-sheer-modulus-vs-frequency?upload_id=${uploadId}`);
};

export default api;