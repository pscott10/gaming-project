import React from 'react'
import '../components/Login.css'
import '../components/NavBar.css'
import {Link} from 'react-router-dom'

export function Login(){
    return (
        <div className= "background-body">
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
        <div className='login-container'>
            <div className="header">
                <div className="text">Login</div>
            </div>
                <div className="inputs">
                <div className="input">
                    <input type="email" placeholder="Email" />
                </div>
                <div className="input">
                    <input type="password" placeholder="Password" />
                </div>
            </div>
            <div className="forgot-password">Forgot Password?<span>Click Here!</span> </div>
            <div className="forgot-password">Don't have an account?<span><Link to="/createAccount">Click Here!</Link></span> </div>
            <div className="submit-container">
                <div className="submit"><Link to="/profile">Login</Link></div>
            </div>
        </div>
        </div>
    )
}

export default Login