import React from 'react'
import '../components/Login.css'

const Login = () => {
    return (
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
    )
}

export default Login