import React from 'react'
import '../components/Login.css'
import '../components/NavBar.css'

const Login = () => {
    return (
        <div className= "background-body">
            <div className="nav-container">
            <h1 className="logo">🎮 Gaming Edge</h1>
            <ul>
                <button className="active">Products</button>
                <button>Home</button>
                <button>About</button>
                <button>Contact</button>
                <button className="sign-in">Sign in</button>
                <button className="register">Register</button>
            </ul>
        </div>
        <div className='login-container'>
            <div className="header">
                <div className="text">Login</div>
            </div>
                <div className="inputs">
                {/* <div className="input">
                    <input type="text" placeholder="Name" />
                </div> */}
                <div className="input">
                    <input type="email" placeholder="Email" />
                </div>
                <div className="input">
                    <input type="password" placeholder="Password" />
                </div>
            </div>
            <div className="forgot-password">Forgot Password?<span>Click Here!</span> </div>
            <div className="submit-container">
                <div className="submit">Login</div>
            </div>
        </div>
        </div>
    )
}

export default Login