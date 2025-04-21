import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';


function Sidebar() {
    return (
        <div className="sidebar-background">
          <div className="sidebar">
            <h1 className="profile">GamingEdge</h1>
            <ul className="sidebar-list">
              <li><NavLink to="/profile" className="sidebar-button">Recent Reports</NavLink></li>
              <li><NavLink to="/history" className="sidebar-button">History</NavLink></li>
              <li><NavLink to="/charts" className="sidebar-button">Charts &amp; Graphs</NavLink></li>
              <li><NavLink to="/settings" className="sidebar-button">Settings</NavLink></li>
              <li><NavLink to="/logout" className="sidebar-button">Logout</NavLink></li>
            </ul>
          </div>
        </div>
    );
}

export default Sidebar;