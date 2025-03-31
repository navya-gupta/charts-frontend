import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true
});

export const uploadCSV = (formData) => api.post('/upload-csv', formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

export const getMasterCurveForAllTemperatures = () => api.get('/get-master-curve-for-all-temperatures');
export const getModulusVsStrainRateVsTemperature = () => api.get('/get-graph-data');
export const getShearModulusVsFrequency = () => api.get('/get-sheer-modulus-vs-frequency');

export default api;
