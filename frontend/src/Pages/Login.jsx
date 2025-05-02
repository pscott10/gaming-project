import React, {useState} from 'react';
import '../components/Login.css';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';

export function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
                {email, password}
            );

            console.log("Login successful:", res.data);
            localStorage.setItem('token', res.data.token);

            let user = res.data.user;
            if (!user) {
            const [, payload] = res.data.token.split(".");
            user = JSON.parse(atob(payload));            
            }
            localStorage.setItem("user", JSON.stringify(user));
        
            navigate('/profile');
        } catch (err){
            console.error("Login error:", err.res?.data || err);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className= "background-body">
            <NavBar />
        <div className='login-container'>
            <div className="header">
                <div className="text">Login</div>
            </div>
            <form onSubmit={handleLogin} className="inputs">
                <div className="inputs">
                <div className="input">
                    <input 
                        type="email"    
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}required 
                    />
                </div>
                <div className="input">
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} required
                    />
                </div>
            </div>
            <div className="submit-container">
                <button className="submit" type="submit">Login</button>
                {/* Google OAuth Login Link */}
                <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`}>
                    <button className="oauth-button">Login with Google</button>
                    </a>
            </div>
            </form>
            <div className="forgot-password"><Link to="/createAccount" className='spanCreateAccount'>Don't have an account?</Link> </div>
        </div>
        </div>
    )
}

export default Login