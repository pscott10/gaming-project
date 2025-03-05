import React from 'react'
import '../components/CreateAccount.css'

const CreateAccount = () => {
    return (
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
            <div className="forgot-password">Already have an account?<span> Click Here!</span> </div>
            <div className="submit-container">
                <div className="submit">Register</div>
                {/* <div className="submit">Login</div> */}
            </div>
        </div>
    )
}

export default CreateAccount