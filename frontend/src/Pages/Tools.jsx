import React, {useState} from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import "../components/Tools.css";

export function Tools(){
    const [wager, setWager] = useState("");
    const [customers, setCustomers] = useState("");

    const avg = wager && customers  
        ? (+wager / +customers).toFixed(2)
        : null;

    const reset = () => {setWager(""); setCustomers("");};

    return (
        <> 
            <NavBar/>
            <div className="main-layout">
                <Sidebar />
                
                <div className="tools-card">
                    <h1 className="tools-title">Gaming Edge Tools</h1>
                    <h2 className="tools-sub">Average Spend Per Customer</h2>
                    
                    <label>Total Spend / Net Wager ($)
                        <input
                            type="number" min="0" step="0.1"
                            value={wager}
                            onChange={e=> setWager(e.target.value)}
                            />
                    </label>

                    <label>Number of Visitors
                        <input
                            type="number" min="1" step="1"
                            value={customers}
                            onChange={e=>setCustomers(e.target.value)}
                        />
                    </label>

                    {avg && ( 
                        <p className="tools-result">
                            Average spend per customer: <strong>${avg}</strong>
                        </p>
                    )}

                    <div className="tools-actions">
                        <button disabled={!avg} onClick={reset}>Clear</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tools;