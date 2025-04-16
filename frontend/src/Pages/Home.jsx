import React from 'react'
import '../components/Home.css'
import {Link} from 'react-router-dom'

export function Home() {
    return (
        <div className= "home-container">
            <div className="header">
                <div className="logo2">Gaming Edge</div>
            </div>
            <div className="buttons">
                <ul>
                    <Link to="/login"><button className="active">Sign In</button></Link>
                    <Link to="/createAccount"><button className="active">Create an Account</button></Link>
                </ul>
            </div>
        </div>
    )
}
