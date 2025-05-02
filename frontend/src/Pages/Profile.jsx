import { useState }          from "react";
import { useNavigate }       from "react-router-dom";
import NavBar                from "../components/NavBar";
import Sidebar               from "../components/Sidebar";
import CreateReportModal     from "../components/CreateReportModal";
import CreateReport          from "../components/CreateReport";
import { useReports }        from "../components/ReportsContext";
import { FaTrashAlt }       from "react-icons/fa";
import "../components/Profile.css";
import "../components/Sidebar.css";

function Profile () {
  const navigate                 = useNavigate();
  const { reports, toggleStar, deleteReport }  = useReports();      
  const starred                  = (reports ?? []).filter(r => r.starred);

  const [open, setOpen]          = useState(false);
  const openModal   = () => setOpen(true);
  const closeModal  = () => setOpen(false);

  const monthOrder = {
    January: 1, February: 2, March: 3,   April: 4,
    May: 5,    June: 6,     July: 7,     August: 8,
    September: 9, October: 10, November: 11, December: 12,
  };

  function formatMonthRange(input, year) {
    if (!input) return "";
  
    let arr = Array.isArray(input) ? input : [input];
    if (arr.length === 1 && typeof arr[0] === "string" && arr[0].includes(",")) {
      arr = arr[0].split(",").map(s => s.trim()).filter(Boolean);
    }
    if (!arr.length) return "";
  
    const sorted = [...new Set(arr)]
      .sort((a, b) => monthOrder[a] - monthOrder[b]);
  
    const range =
      sorted[0] === sorted.at(-1)
        ? sorted[0]
        : `${sorted[0]} – ${sorted.at(-1)}`;   
  
    return year ? `${range} ${year}` : range;
  }

  const fmtList = v =>
    !v ? "" :
    Array.isArray(v) ? v.join(", ") :
    v.split(",").map(s => s.trim()).join(", ");

  const Row = (report) => {
    const filters        = JSON.parse(report.filters || "{}");
    const municipalities = fmtList(filters.municipalities);
    const monthRange = formatMonthRange(filters.month, filters.year);

    return (
      <div
        key={report.id}
        className="report-row"
        onClick={() => navigate(`/report/${report.id}`)}
        style={{
          cursor:"pointer", border:"1px solid #ccc", padding:"10px",
          marginBottom:"5px", borderRadius:"5px",
          display:"flex", justifyContent:"space-between", alignItems:"center"
        }}
      >
        <div>
          <strong>{report.title}</strong>
          <div>{municipalities}</div>
          <div>{monthRange}</div>
        </div>

        <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
          <button
            onClick={e => { e.stopPropagation(); toggleStar(report.id, !report.starred); }}
            style={{
              background:"none", border:"none", cursor:"pointer",
              fontSize:"20px", color: report.starred ? "gold" : "#999"
            }}
          >
            {report.starred ? "★" : "☆"}
          </button>

          <button
            onClick={e => { e.stopPropagation(); deleteReport(report.id); }}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#c33" }}
            title="Delete report"
          >
            <FaTrashAlt/>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <NavBar/>
      <div className="main-layout">
        <Sidebar/>

        <div className="profile-content">
          <div className="profile-header">
            <div className="header-left">
              <h2 className="savedreports-header">Starred Reports</h2>
              <button className="create-report" onClick={openModal}>
                Create Report
              </button>
            </div>
          </div>

          <div className="reports-list">
            {reports === null
              ? <p>Loading…</p>
              : starred.length === 0
              ? <p>No starred reports</p>
              : starred.map(Row)}
          </div>
        </div>
      </div>

      {/* create-report modal */}
      <CreateReportModal isOpen={open} onClose={closeModal}>
        <CreateReport/>
      </CreateReportModal>
    </div>
  );
}

export default Profile;
