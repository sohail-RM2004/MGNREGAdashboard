import axios from "axios";
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default {
  getStates: () => axios.get(`${BASE}/states`).then(r => r.data),
  getDistrictsByState: (stateCode) => axios.get(`${BASE}/districts/${stateCode}`).then(r => r.data),
  getDistrictPerformance: (districtCode) => axios.get(`${BASE}/performance/${districtCode}`).then(r => r.data),
  getDistrictTrend: (districtCode) => axios.get(`${BASE}/performance/${districtCode}/trend`).then(r => r.data),
  getDistrictSummary: (districtCode) => axios.get(`${BASE}/performance/${districtCode}/summary`).then(r => r.data),
  getStateStats: (stateCode) => axios.get(`${BASE}/performance/state/${stateCode}`).then(r => r.data),
  compareDistricts: (a,b) => axios.get(`${BASE}/compare?districtA=${a}&districtB=${b}`).then(r => r.data)
};
