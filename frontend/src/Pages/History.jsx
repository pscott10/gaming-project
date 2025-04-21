import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { toggleStarRequest } from "../components/starReports";

function History() {
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        axios
        .get(`${API_BASE}/api/reports/history`, {
            headers: {Authorization: `Bearer: ${token}`},
        })
        .then((res) => setReports(res.data))
        .catch(console.error);
    }, []);

    const toggleStar = (id, starred) => {
        toggleStarRequest(id, !starred)
        .then(() => {
            setReports(prev =>
              prev
                .map(r =>                   
                  r.id === id ? { ...r, starred: !r.starred } : r
                )
            );
          })
          .catch(console.error);
    };

    const renderRow = (r) => {
        let filters = {};
        try { filters = JSON.parse(r.filters); } catch {}
        const muni   = filters.municipalities || "";
        const months = filters.month || "";
    

        return (
            <div key={r.id} className="report-row" onClick={() => nav(`/report/${r.id}`)}>
            <div>
            <strong>{r.title}</strong>
            <div>{muni}</div>
            <div>{months}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); toggleStar(r.id, r.starred); }}>
            {r.starred ? "★" : "☆"}
            </button>
        </div>
        );
    };
  
    return (
        <div className="profile-container">
            <NavBar />
            <div className="main-layout">
                <Sidebar />
                <div className="profile-content">
                    <h2 className="savedreports-header">All Reports</h2>
                    {reports.length ? reports.map(renderRow) : <p>No reports</p>}
                </div>
            </div>
        </div>
    );
}

export default History;