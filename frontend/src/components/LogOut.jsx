import React from "react";
import '../components/LogOut.css';

export default function LogOut(){
    return(
        <div className='logout-container'>
            <h1 className='logout-header'>Logout?</h1>
            <ul>
                <li className = 'logout-list'><button className='confirm-logout'>Confirm Logout</button></li>
                <li className ='logout-list'><button className ='confirm-logout'>Cancel</button></li>
            </ul>
        </div>
    );
};