import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

function ReportTable(){
    const{id} = useParams();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>{
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/history/${id}`)
            .then(response => {
                setReportData(response.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching report:', err);
                setError(err);
                setLoading(false);
            });
        }, [id]);

        if (loading) return <p>Loading report...</p>;
  if (error) return <p>Error loading report: {error.message}</p>;
  if (!reportData || reportData.length === 0) return <p>No report data available.</p>;

  return (
    <div>
      <h2>Comprehensive Report #{id}</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Municipality</th>
            <th>Establishment</th>
            <th>License Number</th>
            <th>VGT Count</th>
            <th>Amount Played</th>
            <th>Amount Won</th>
            <th>Net Wager</th>
            <th>Funds In</th>
            <th>Funds Out</th>
            <th>Net Terminal Income</th>
            <th>NTI Tax</th>
            <th>State Share</th>
            <th>Municipality Share</th>
            <th>Month</th>
            <th>Year</th>
            <th>Local Tax</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td>{row.Municipality}</td>
              <td>{row.Establishment}</td>
              <td>{row.LicenseNumber}</td>
              <td>{row.VGTCount}</td>
              <td>{row.AmountPlayed}</td>
              <td>{row.AmountWon}</td>
              <td>{row.NetWager}</td>
              <td>{row.FundsIn}</td>
              <td>{row.FundsOut}</td>
              <td>{row.NetTerminalIncome}</td>
              <td>{row.NTITax}</td>
              <td>{row.StateShare}</td>
              <td>{row.MunicipalityShare}</td>
              <td>{row.Month}</td>
              <td>{row.Year}</td>
              <td>{row["Local Tax"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}   

export default ReportTable;