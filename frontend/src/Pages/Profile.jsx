import React from 'react'
import '../components/NavBar.css'
import '../components/Profile.css'
import '../components/Sidebar.css'
import {Link} from 'react-router-dom'

export function Profile() {
    return (
        <div>
            <div className="nav-container">
             <h1 className="logo">🎮 Gaming Edge</h1>
             <ul>
                 <Link to="/"><button>Home</button></Link>
                 <button>About</button>
                 <button>Contact</button>
                 <Link to="/login"><button className="sign-in">Sign in</button></Link>
                 <Link to="/createAccount"><button className="register">Register</button></Link>
             </ul>
             </div>
            <div className="sidebar-background">
                <div className="sidebar">
                    <h1 className="profile">Profile</h1>
                    <ul>
                        <button className="sidebar-button">Saved Reports</button>
                        <button className="sidebar-button">History</button>
                        <button className="sidebar-button">Calculations</button>
                    </ul>
                </div>
                <div className="profile-header">
             <ul className="logo">Saved Reports
             <button className="create-report">Create Report</button>
             </ul>
                 <button className="report-list">Report 1</button>
                 <button className="report-list">Report 2</button>
                 <button className="report-list">Report 3</button>
            </div>
         </div>
        </div>
    )
}
export default Profile