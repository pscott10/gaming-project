import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ReportsCtx = createContext();

export const useReports = () => useContext(ReportsCtx);

export function ReportsProvider({ children }) {
  const API     = import.meta.env.VITE_API_BASE_URL;
  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [reports, setReports] = useState(null);        

  /* initial fetch */
  useEffect(() => {
    axios
      .get(`${API}/api/reports/history`, { headers })
      .then(res => setReports(res.data))
      .catch(err => { console.error(err); setReports([]); });
  }, []);

  /* toggle star */
  const toggleStar = async (id, starred) => {
    await axios.patch(`${API}/api/reports/${id}/star`, { starred }, { headers });
    setReports(r =>
      r.map(rep => rep.id === id ? { ...rep, starred } : rep)
    );
  };

  /* delete report */
  const deleteReport = async (id) => {
    await axios.delete(`${API}/api/reports/${id}`, { headers });
    setReports(r => r.filter(rep => rep.id !== id));
  };

  const value = { reports, toggleStar, deleteReport };

  return <ReportsCtx.Provider value={value}>{children}</ReportsCtx.Provider>;
}
