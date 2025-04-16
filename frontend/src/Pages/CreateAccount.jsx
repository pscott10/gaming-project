import React, {useState} from 'react'
import '../components/CreateAccount.css'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import NavBar from '../components/NavBar';


export function CreateAccount(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const navigate = useNavigate;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const reponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
                {name, email, password}
            );
            console.log("Signup successful:", Response.data);
            alert("Account created successfully! Continue to log in.");
            navigate('/login');
        } catch (error){
            console.error("Signup error:", error.response?.data || error);
            alert("Error creating account. Please try again.");
        }
    };


    return (
        <div className="background-body">
            <NavBar />
        <div className='account-container'>
            <div className="header">
                <div className="text">Create an Account</div>
            </div>
            <form onSubmit={handleSubmit} className="inputs">
                <div className="inputs">
                 <div className="input">
                    <input 
                    type="text" 
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div> 
                <div className="input">
                    <input 
                    type="email" 
                    placeholder="Email"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div className="input">
                    <input 
                    type="password" 
                    placeholder="Password"
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
            </div>
            <div className="forgot-password">
                Already have an account?
                <span>
                    <Link to="/login" className='forgetSpan'> Click Here!</Link>
                </span> 
            </div>
            <div className="submiting-container">
                <button type="submit" className="submit">Register</button>
            </div>
            </form>
        </div>
        </div>
    )
}

export default CreateAccount