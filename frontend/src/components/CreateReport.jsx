import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import "../components/CreateReportModal.css";

function CreateReport(){
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [municipalityOptions, setMunicipalityOptions] = useState([]);
    const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/municipalities`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(res => {
            const opts = res.data.map(muni => ({ label: muni, value: muni }));
            setMunicipalityOptions(opts);
          })
          .catch(console.error);
      }, []);
      

    const handleSubmit = async (e) => {
        e.preventDefault();
        const monthNames = date =>
          date.toLocaleString("default", { month: "long" });
        const filters = {
          month: [monthNames(startDate), monthNames(endDate)],
          year: startDate.getFullYear(),
          municipalities: selectedMunicipalities.map(opt=>opt.value)
        };
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/reports/comprehensive`,
            { filters, customColumns: [], title },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          navigate(`/report/${response.data.reportID}`);
        } catch (err) {
          console.error(err);
        alert("Error creating report");
        }
    };

    return (
        <div className="create-report-form">
            <h1>Create Comprehensive Report</h1>
            <form onSubmit={handleSubmit}>
            <label>
                Report Title
                <input
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                    required
                />
            </label>

            <label>
                Start Month & Year
                <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker                        placeholderText="Select start month"
                    required
                />
            </label>

            <label>
                End Month & Year
                <DatePicker
                selected={endDate}
                onChange={setEndDate}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                placeholderText="Select end month"
                required
                />
            </label>

            <label>Municipalities</label>
            <Select
                isMulti
                options={municipalityOptions}
                value={selectedMunicipalities}
                onChange={setSelectedMunicipalities}
                placeholder="Type to search..."
            />
            <button type="submit" className="submit-report-btn">
        Create Report
      </button>
    </form>
    </div>
  );
}

export default CreateReport;