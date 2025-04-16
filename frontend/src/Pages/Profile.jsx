import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import '../components/Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import CreateReportModal from '../components/CreateReportModal';
import CreateReport from '../components/CreateReport';
import axios from 'axios';


export function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentReports, setRecentReports] = useState([]); // State for reports list
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token    = localStorage.getItem('token');

  // Fetch recent comprehensive reports for the logged-in user
  useEffect(() => {
  axios.get(
    `${API_BASE}/api/reports/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  .then(res => setRecentReports(res.data))
  .catch(console.error);
}, []);

  //toggle stars and sort so starred reports are at the top
  const toggleStar = (reportId, currentlyStarred) => {
    axios.patch(
      `${API_BASE}/api/reports/${reportId}/star`,
      { starred: !currentlyStarred },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setRecentReports(prev => {
        const updated = prev.map(r =>
          r.id === reportId ? { ...r, starred: !r.starred } : r
        );
        updated.sort((a, b) => (b.starred === a.starred ? 0 : b.starred ? 1 : -1));
        return updated;
      });
    })
    .catch(console.error);
  };
  
  // get each report row
  const renderReportRow = (report) => {
    // extract municipalities and month range.
    let filters = {};
    try {
      filters = JSON.parse(report.filters);
    } catch (error) {
      console.error("Error parsing report filters", error);
    }
    const municipalities = filters.municipalities || "";
    const month = filters.month || "";
    return (
      <div 
        key={report.id}
        className={`report-row ${report.starred ? 'starred' : ''}`}
        onClick={() => navigate(`/report/${report.id}`)}
        style={{
          cursor: "pointer",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "5px",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <strong>{report.title}</strong>
          <div>{municipalities}</div>
          <div>{month}</div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click from triggering navigation
            toggleStar(report.id, report.starred);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px"
          }}
        >
          {report.starred ? "★" : "☆"}
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
          <div className="profile-header">
            <div className="header-left">
              <h2 className="savedreports-header">Recent Reports</h2>
              <button className="create-report" onClick={openModal}>Create Report</button>
            </div>
          </div>
          {/*get list of recent reports*/}
          <div className="reports-list">
            {recentReports.length > 0 ? (
              recentReports.map(report => renderReportRow(report))
            ) : (
              <p>No recent reports</p>
            )}
          </div>
        </div>
      </div>
      <CreateReportModal isOpen={isModalOpen} onClose={closeModal}>
        <CreateReport />
      </CreateReportModal>
    </div>
  );
}

export default Profile;
