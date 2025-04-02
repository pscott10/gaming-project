import React from 'react'
import '../components/CreateAccount.css'
import '../components/NavBar.css'
import {Link} from 'react-router-dom'

export function CreateAccount(){
    return (
        <div className="background-body">
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
        <div className='account-container'>
            <div className="header">
                <div className="text">Create an Account</div>
            </div>
                <div className="inputs">
                 <div className="input">
                    <input type="text" placeholder="Name" />
                </div> 
                <div className="input">
                    <input type="email" placeholder="Email" />
                </div>
                <div className="input">
                    <input type="password" placeholder="Password" />
                </div>
            </div>
            <div className="forgot-password">Already have an account?<span><Link to="/login"> Click Here!</Link></span> </div>
            <div className="submit-container">
                <div className="submit">Register</div>
                {/* <div className="submit">Login</div> */}
            </div>
        </div>
        </div>
    )
}

export default CreateAccount