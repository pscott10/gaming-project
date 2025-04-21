import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
const token = () => localStorage.getItem("token");

export async function toggleStarRequest(id, newState) {
  return axios.patch(
    `${API}/api/reports/${id}/star`,
    { starred: newState },
    { headers: { Authorization: `Bearer ${token()}` } }
  );
}