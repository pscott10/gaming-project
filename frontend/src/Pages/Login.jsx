import React, {useState} from 'react';
import '../components/Login.css';
import '../components/NavBar.css';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';

export function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
                {email, password}
            );
            console.log("Login successful:", response.data);
            localStorage.setItem('token', response.data.token);
            alert("Login successful");
            navigate('/profile');
        } catch (error){
            console.error("Login error:", error.response.data);
            alert("Login failed. Please check your credentials.");
        }
    };


    return (
        <div className= "background-body">
            <div className="nav-container">
            <h1 className="logo">Gaming Edge</h1>
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
            </div>
            </form>
            <div style={{marginTop: '1rem'}}>
                {/* Google OAuth Login Link */}
                <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`}>
                    <button className="oauth-button">Login with Google</button>
                    </a>
            </div>
            <div className="forgot-password">Forgot Password?<span>Click Here!</span> </div>
            <div className="forgot-password">Don't have an account?<span><Link to="/createAccount">Click Here!</Link></span> </div>
        </div>
        </div>
    )
}

export default Login