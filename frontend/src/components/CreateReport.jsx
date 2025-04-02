import React, { useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function CreateReport(){
    const [title, setTitle] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [municipalities, setMunicipalities] = useState('');
    const [customFormula, setCustomFormula] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const filters = {
            month,
            year,
            municipalities,
        };
        
        const customColumns = customFormula 
      ? [{ columnName: "Local Tax", formula: customFormula }] 
      : [];
        
        try{
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/reports/comprehensive`,
                {
                    filters,
                    customColumns,
                    title 
                }
            );
            console.log("Report Created:", response.data);
            //GOTO Report Detail Page
        } catch (error) {
            console.log(import.meta.env.VITE_API_BASE_URL);

            console.error("Error creating report:", error);
            alert("Error creating report. Please check the console for details.");
        }
    };

    return (
        <div className="create-report-container">
            <h1>Create Comprehensive Report</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Report Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Month:</label>
                    <input  
                        type="text"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        placeholder="e.g., January"
                        required
                    />
                </div>
                <div>
                <label>Year:</label>
                    <input 
                        type="text" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        placeholder="e.g., 2024" 
                        required 
                    />
                    </div>
                <div>
                <label>Municipalities (comma-separated):</label>
                <input 
                        type="text" 
                        value={municipalities} 
                        onChange={(e) => setMunicipalities(e.target.value)} 
                        placeholder="e.g., Clay County, Adams County" 
                        required 
                />
                </div>
                <div>
                <label>Local Tax Formula (optional):</label>
                <input 
                        type="text" 
                        value={customFormula} 
                        onChange={(e) => setCustomFormula(e.target.value)} 
                        placeholder="e.g., FundsIn * 0.1" 
                />
                </div>
                <button type="submit">Create Report</button>
            </form>
        </div>   
    );
}

export default CreateReport;