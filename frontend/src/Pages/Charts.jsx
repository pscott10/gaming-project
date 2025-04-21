import React from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import '../components/Charts.css';
import '../components/Profile.css'; 

function Charts(){
  return (
    <div className="charts-container">
      <NavBar />
      <div className="main-layout">
        <Sidebar />
        <div className="charts-content">
          <h2>Charts &amp; Graphs</h2>
          <p>🚧 Coming soon! 🚧</p>
        </div>
      </div>
    </div>
  );
}

export default Charts;