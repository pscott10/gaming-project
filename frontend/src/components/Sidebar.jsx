import React from 'react'
import '../components/Sidebar.css'

function Sidebar(){
    return <div className="sidebar-background">
        <div className="sidebar">
            <h1 className="profile">Profile</h1>
            <ul>
                <button className="sidebar-button">Saved Reports</button>
                <button>History</button>
                <button>Calculations</button>
            </ul>
        </div>
    </div>
}

export default Sidebar 