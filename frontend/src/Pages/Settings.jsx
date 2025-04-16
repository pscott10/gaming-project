import React from "react";
import DarkMode from "../components/DarkMode";

export default function Settings(){
    return(
        <div className='settings-container'>
            <h1 className="welcome-header">Welcome, User!</h1>
            <ul>
                <DarkMode/>
                <span>Change Password?</span>
            </ul>
        </div>
    );
};
