 import React from "react";
import DarkMode from "../components/DarkMode";
import Sidebar from "../components/Sidebar";
import NavBar from '../components/NavBar'


export default function Settings(){
    return(
        <div className='settings-container'>
            <NavBar />
            <div className = 'main-layout'>
                <Sidebar /> 
                <div className="profile-content">
            <h1 className="welcome-header">Settings</h1>
            <ul >
                <DarkMode/>
                <span>Change Password?</span>
            </ul>
            </div>
            </div>
        </div>
    );
}; 
