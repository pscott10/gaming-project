import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import CreateReportModal from '../components/CreateReportModal';
import CreateReport from '../components/CreateReport';
import LogOut from '../components/LogOut';
import Settings from '../Pages/Settings';
import '../components/Profile.css'; 
import '../components/Sidebar.css';
import { toggleStarRequest } from '../components/starReports';


function Profile() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token    = localStorage.getItem('token');
  const navigate = useNavigate();

  // modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSettingsOpen,     setIsSettingsOpen]   = useState(false);
  const [isLogOutOpen,       setIsLogOutOpen]     = useState(false);

  // reports state
  const [starredReports, setStarredReports] = useState([]);

  // open/close helpers
  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const openLogOut = () => setIsLogOutOpen(true);
  const closeLogOut = () => setIsLogOutOpen(false);
  
  // Fetch starred comprehensive reports for the logged‑in user
  useEffect(() => {
    axios.get(
      `${API_BASE}/api/reports/starred`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setStarredReports(res.data))
    .catch(console.error);
  }, [API_BASE, token]);

  // toggle star
  const handleToggleStar = (reportId, currentlyStarred) => {
    toggleStarRequest(reportId, !currentlyStarred)
      .then(() => {
        setStarredReports((prev) =>
          prev
            .map((r) =>
              r.id === reportId ? { ...r, starred: !r.starred } : r
            )
            .filter((r) => r.starred) // keep only starred for this page
        );
      })
      .catch(console.error);
};

   {/* axios.patch(
      `${API_BASE}/api/reports/${reportId}/star`,
      { starred: !currentlyStarred },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      setRecentReports(prev => {
        const updated = prev.map(r =>
          r.id === reportId ? { ...r, starred: !r.starred } : r
        );
        // starred first
        updated.sort((a, b) => (b.starred === a.starred ? 0 : b.starred ? 1 : -1));
        return updated;
      });
    })
    .catch(console.error);
  }; */}

  // render one row
  const renderRow = (report) => {
    let filters = {};
    try {
      filters = JSON.parse(report.filters);
    } catch {}

    const municipalities = filters.municipalities || '';
    const monthList      = filters.month         || '';

    return (
      <div
        key={report.id}
        className="report-row"
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
          <div>{monthList}</div>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            handleToggleStar(report.id, report.starred);
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
        {/*<div className="sidebar-background">
        <div className="sidebar">
            <h1 className="profile">Profile</h1>
            <ul>
                <button className="sidebar-button">Starred Reports</button>
                <button>History</button>
                <button>Calculations</button>
            </ul>
        </div>
      </div>*/}
      <div className="profile-content">
        <div className="profile-header">
          <div className="header-left">
            <h2 className="savedreports-header">Starred Reports</h2>
            <button className="create-report" onClick={openReportModal}>
              Create Report
            </button>
          </div>

          <button className="sidebar-button" onClick={openSettings}>
            Settings
          </button>
          <button className="sidebar-button" onClick={openLogOut}>
            Logout
          </button>
        </div>

        {/*List of starred reports*/}
        <div className="reports-list">
          {starredReports.length ? (
            starredReports.map(renderRow)
          ) : (
            <p>No starred reports</p>
          )}
        </div>

        {/* <div className="reports-list">
      {recentReports.length > 0
        ? recentReports.map(renderReportRow)
        : <p>No recent reports</p>
      }
    </div> */}
      </div>
      </div>
      <CreateReportModal isOpen={isReportModalOpen} onClose={closeReportModal}>
        <CreateReport />
      </CreateReportModal>
      <CreateReportModal isOpen={isSettingsOpen} onClose={closeSettings}>
        <Settings />
      </CreateReportModal>
      <CreateReportModal isOpen={isLogOutOpen} onClose={closeLogOut}>
        <LogOut />
      </CreateReportModal>
    </div>
  );
};


export default Profile;