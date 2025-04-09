import React, {useState} from 'react'
import '../components/CreateAccount.css'
import '../components/NavBar.css'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';


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
                    <Link to="/login"> Click Here!</Link>
                </span> 
            </div>
            <div className="submit-container">
                <button type="submit" className="submit">Register</button>
                {/* <div className="submit">Login</div> */}
            </div>
            </form>
        </div>
        </div>
    )
}

export default CreateAccount