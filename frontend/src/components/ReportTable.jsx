import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import { evaluate } from 'mathjs';
import CreateReportModal from './CreateReportModal';

function ReportTable(){
    const{id} = useParams();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customColumns, setCustomColumns] = useState([]);
    const [reportInfo, setReportInfo] = useState(null);

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
      { key: "Month", label: "Month" },
      { key: "Year", label: "Year" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(defaultColumns.map(col => col.key));

    const[modalOpen, setModalOpen] = useState(false);
    const[newColumnName, setNewColumnName] = useState('');
    const[newFormula, setNewFormula] = useState('');


    useEffect(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/history/${id}`)
        .then(response => {
          console.log("Fetched report:", response.data);
          setReportInfo(response.data);
          let rows = [];
          try {
            rows = JSON.parse(response.data.data);
          } catch (err) {
            console.error("Error parsing report data:", err);
            rows = response.data.data || [];
          }
          setReportData(rows);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching report:", err);
          setError(err);
          setLoading(false);
        });
    }, [id]);

      const handleAddCustomColumn = (e) => {
        e.preventDefault();
        if(newColumnName && newFormula) {
          const newCol = {columnName: newColumnName, formula: newFormula};
          setCustomColumns([...customColumns, newCol]);
          setNewColumnName('');
          setNewFormula('');
          setModalOpen(false);
        }
      };

      const toggleColumnVisibility = (columnKey) => {
        setVisibleColumns((prev) => 
          prev.includes(columnKey) ? prev.filter(key => key !== columnKey) : [...prev, columnKey]
        );
      };

      if (loading) return <p>Loading report...</p>;
      if (error) return <p>Error loading report: {error.message}</p>;
      if (!reportData || reportData.length === 0) return <p>No report data available.</p>;

      return (
        <div>
          {reportInfo && reportInfo.title && <h2>{reportInfo.title}</h2>}
          
          <div style={{marginButtom: '1rem'}}>
            <h3>Toggle Columns:</h3>
            {defaultColumns.map(col => (
              <label key={col.key} style={{marginRight: '1rem'}}>
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col.key)}
                  onChange={() => toggleColumnVisibility(col.key)}
                  /> {col.label}
              </label>
            ))}
          </div>

          <button onClick={() => setModalOpen(true)}>Add Custom Column</button>
          {customColumns.length > 0 && (
            <div>
              <h3>Custom Columns:</h3>
              <ul>
                {customColumns.map((col, idx) => (
                  <li key={idx}>
                    {col.columnName} ({col.formula}){" "}
                    <button onClick={() => {
                      const updated = [...customColumns];
                      updated.splice(idx, 1);
                      setCustomColumns(updated);
                    }}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <CreateReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <h3>Add Custom Column</h3>
            <form onSubmit={handleAddCustomColumn}>
              <div>
                <label>Column Name:</label>
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Formula:</label>
                <input
                  type="text"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  placeholder="e.g., FundsIn * 0.1"
                  required
                />
              </div>
              <button type="submit">Add Column</button>
            </form>
          </CreateReportModal>

          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {/* Render default column headers only if visible */}
              {defaultColumns
                .filter(col => visibleColumns.includes(col.key))
                .map((col, colIndex) => (
                  <th key={colIndex}>{col.label}</th>
                ))}
              {/* Render custom column headers */}
              {customColumns.map((col, idx) => (
                <th key={`custom-header-${idx}`}>{col.columnName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Render each default column cell if the column is visible */}
                {defaultColumns
                  .filter(col => visibleColumns.includes(col.key))
                  .map((col, colIndex) => (
                    <td key={`row-${rowIndex}-col-${colIndex}`}>{row[col.key]}</td>
                  ))}
                {/* Render calculated values for custom columns */}
                {customColumns.map((col, colIndex) => {
                  let computed = '';
                  try {
                    computed = evaluate(col.formula, row);
                  } catch (error) {
                    console.error(`Error evaluating custom column ${col.columnName} for row ${rowIndex}:`, error);
                  }
                  return <td key={`row-${rowIndex}-custom-${colIndex}`}>{computed}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }   

export default ReportTable;