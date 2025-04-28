import React, {useEffect, useState, useMemo} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { evaluate } from 'mathjs';
import CreateReportModal from '../components/CreateReportModal.jsx';
import "../components/ReportTable.css";
import NavBar from "../components/NavBar";
import notebookIcon from '../assets/journal-text.svg';

function ReportTable(){
    const token = localStorage.getItem('token');
    const{id} = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
    const [reportInfo, setReportInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [customColumns, setCustomColumns] = useState([]);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });
    const [modalOpen, setModalOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");
    const [newFormula, setNewFormula] = useState("");
    const [modalTab, setModalTab] = useState("add"); //can be add or hidden
    const [notesModalOpen, setNotesModalOpen] = useState(false);
    const [notes, setNotes] = useState('');
    const [editingNotes, setEditingNotes] = useState(false);

    const defaultColumns = [
      { key: "Municipality", label: "Municipality" },
      { key: "Establishment", label: "Establishment" },
      { key: "LicenseNumber", label: "License Number" },
      { key: "VGTCount", label: "VGT Count" },
      { key: "AmountPlayed", label: "Amount Played" },
      { key: "AmountWon", label: "Amount Won" },
      { key: "NetWager", label: "Net Wager" },
      { key: "FundsIn", label: "Funds In" },
      { key: "FundsOut", label: "Funds Out" },
      { key: "NetTerminalIncome", label: "Net Terminal Income" },
      { key: "NTITax", label: "NTI Tax" },
      { key: "StateShare", label: "State Share" },
      { key: "MunicipalityShare", label: "Municipality Share" },
      //{ key: "Month", label: "Month" },
      //{ key: "Year", label: "Year" },
    ];

    const monthOrder = {
      January:  1, February: 2, March:      3,
      April:    4, May:       5, June:      6,
      July:     7, August:    8, September: 9,
      October: 10, November: 11, December: 12,
    };

    useEffect(() => {
      const token = localStorage.getItem("token");
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/history/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const payload = res.data;
          setReportInfo(payload);
    
          setReportData(JSON.parse(payload.data || "[]"));
    
          setNotes(payload.notes || "");
    
          const hidden = typeof payload.hidden_columns === "string"
            ? JSON.parse(payload.hidden_columns || "[]")
            : payload.hidden_columns || [];
          setHiddenColumns(hidden);
    
          const custom = typeof payload.custom_columns === "string"
            ? JSON.parse(payload.custom_columns || "[]")
            : payload.custom_columns || [];
          setCustomColumns(custom);
        })
        .catch((e) => setError(e))
        .finally(() => setLoading(false));
    }, [id]);

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
  
    
    //sorting data
    const requestSort = (key) => {
      let dir = "asc";
      if (sortConfig.key === key && sortConfig.dir === "asc") {
        dir = "desc";
      }
      setSortConfig({ key, dir });
    };

    const sortedData = useMemo(() => {
      let arr = [...reportData];
      if(sortConfig.key){
        arr.sort((a,b) => {
          let x = a[sortConfig.key];
          let y = b[sortConfig.key];
          if (typeof x === 'string') x = x.toLowerCase();
          if (typeof y === 'string') y = y.toLowerCase();

          if (x < y) return sortConfig.dir === 'asc' ? -1 : 1;
          if (x > y) return sortConfig.dir === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return arr;
    }, [reportData, sortConfig]);

    const persistCustomColumns = async (cols) => {
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/api/reports/${reportInfo.id}/custom-columns`,
          { customColumns: cols },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } catch (e) {
        console.error("Failed to persist custom columns:", e);
      }
    };

    //custom columns
    const handleAddCustomColumn = async (e) => {
      e.preventDefault();
      if (!newColumnName || !newFormula) return;

      const updated = [
        ...customColumns,
        { columnName: newColumnName, formula: newFormula },
      ];

      try{
        await persistCustomColumns(updated);

          setCustomColumns([...customColumns, { columnName: newColumnName, formula: newFormula }]);
          setNewColumnName("");
          setNewFormula("");
          setModalOpen(false);
        } catch (err) {
          console.error("Could not save custom columns:", err);
          alert("Saving your custom columns failed :( try again");
        }
    };

    //toggle column visibility
    const toggleColumnVisibility = (colKey) => {
      const updated = hiddenColumns.includes(colKey)
        ? hiddenColumns.filter(c => c !== colKey)
        : [...hiddenColumns, colKey];

      // send to server
      axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/${id}/hidden`,
        { hiddenColumns: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setHiddenColumns(res.data.hiddenColumns);
      })
      .catch(console.error);
    };

    const saveNotes = () => {
      axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/${id}/notes`,
        {notes},
        {headers: {Authorization: `Bearer ${token}`}}
      ).then(() => {
        setEditingNotes(false);
        setNotesModalOpen(false);
      }).catch(console.error);
    };

    const handleExportCSV = () => {
      //build header row
      const filters = JSON.parse(reportInfo.filters);
      const monthList = Array.isArray(filters.month)
        ? filters.month.join(", ")
        : filters.month;
      const year = filters.year;

      const visibleDefaults = defaultColumns.filter(c => !hiddenColumns.includes(c.key));
      const headers = [
        ...visibleDefaults.map(c => c.label),
        ...customColumns.map(c => c.columnName)
      ];
      const colCount = headers.length;

      const pad = (row) =>
        [...row, ...Array(Math.max(0, colCount - row.length)).fill("")];

      const meta = [
        pad(["GamingEdge Reports"]),                   
        pad(["Report Title", reportInfo.title]),      
        pad(["Months", monthList, "Year", year]),    
        Array(colCount).fill("")                       
      ];

      //data rows
      const dataRows = sortedData.map(row => {
        const defaultValues = visibleDefaults.map(c => {
          const v = row[c.key];
          return typeof v === "number" ? v.toFixed(2) : `"${String(v).replace(/"/g,'""')}"`;
        });
        const customValues = customColumns.map(c => {
          let val = "";
          try { val = Number(evaluate(c.formula, row)).toFixed(2); }
          catch{} 
          return val;
        });
        return [...defaultValues, ...customValues].join(",");
      });

      //notes
      const notesText = notes.replace(/"/g, '""');
      const notesRow = pad(["Notes", notesText]);

      //combine
      const lines = [
        ...meta.map(r => r.join(",")),
        headers.join(","),
        ...dataRows,
        "",
        notesRow.join(",")
      ];
      const csvContent = lines.join("\r\n");

      //download
      const blob = new Blob([csvContent], {type: "text/csv"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportInfo.title || "report"}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading report: {error.message}</p>;
    if (!reportData || reportData.length === 0) return <p>No report data available.</p>;

    return (
      <>
      <NavBar />
      <div className="rt-container">
        <button className="back-btn" onClick={() => navigate('/profile')}>← Back</button>
        <h1 className="rt-title">{reportInfo?.title}</h1>
        {reportInfo?.filters && (
          <h3 className="rt-subtitle">
          {formatMonthRange(
            JSON.parse(reportInfo.filters).month,
            JSON.parse(reportInfo.filters).year
          )}
          </h3>
        )}

        <div className="rt-controls"> 
          <button className="notes-btn" onClick={()=>setNotesModalOpen(true)}>
            <img src={notebookIcon} alt="Notes" />
          </button>
          <button className="add-col-btn" onClick={() => setModalOpen(true)}>+ Add Column</button>
          <button className="export-csv-btn" onClick={handleExportCSV}>Export CSV</button>
        </div>

        <CreateReportModal isOpen={notesModalOpen} onClose={() => setNotesModalOpen(false)}
        >
          <h3>Report Notes</h3>
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Type anything about this report..."
          />
          <button className="notes-save-btn" onClick={saveNotes}>
            Save &amp; Close 
          </button>
        </CreateReportModal>

        <CreateReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="modal-tabs">
            <button
              className={modalTab === "add" ? "active" : ""}
              onClick={() => setModalTab("add")}
              >Custom Column</button>
            <button
              className={modalTab === "hidden" ? "active" : ""}
              onClick={() => setModalTab("hidden")}
              >Show Hidden</button>
          </div>

          {modalTab === "add" ? (
            <form onSubmit={handleAddCustomColumn} className="custom-col-form">
              <label>
                Column Name
                <input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  required
                  />
              </label>
              <label>
                Formula
                <input
                  list="colKeys"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  placeholder="e.g. FundsIn * 0.1"
                  required
                  />
                <datalist id="colKeys">
                  {defaultColumns.map((c) => (
                    <option key={c.key} value={c.key} />
                  ))}
                </datalist>
              </label>
              <button type="submit">Add</button>
            </form>
          ) : (
            <div className="hidden-cols-list">
              {defaultColumns
                .filter(c => hiddenColumns.includes(c.key))
                .map(c => (
                  <div key={c.key}>
                    {c.label}
                    <button onClick={() => toggleColumnVisibility(c.key)}>
                      Unhide
                    </button>
                  </div>
              ))}
              {hiddenColumns.length === 0 && <p>No hidden columns.</p>}
            </div>
          )}
        </CreateReportModal>

        <div className="rt-table-wrapper">
          <table className="rt-table">
            <thead>
            <tr>
            {defaultColumns.map(col => !hiddenColumns.includes(col.key) && (
                <th key={col.key} className="rt-th" onClick={() => requestSort(col.key)}>
                  <span className="th-label">{col.label}</span>
                  <span className="th-hide" onClick={() => toggleColumnVisibility(col.key)}>×</span>
                  {sortConfig.key === col.key && (
                    <span className="th-sort">
                      {sortConfig.dir === "asc" ? "⬆" : "⬇"}
                    </span>
                  )}
                </th>
              ))}
              {customColumns.map((c) => (
                  <th key={c.columnName} className="rt-th-custom">{c.columnName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
              {sortedData.map((row, idx) => (
                <tr key={idx}>
                  {defaultColumns.map(col => !hiddenColumns.includes(col.key) && (
                    <td key={col.key} className="rt-td">
                      {typeof row[col.key] === 'number' ? row[col.key].toFixed(2) : row[col.key]}
                    </td>
                  ))}
                  {customColumns.map((c, ci) => (
                    <td key={ci} className="rt-td-custom">
                      {Number(evaluate(c.formula, row)).toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
    </>
  );
}

export default ReportTable;