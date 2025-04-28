import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../components/Navbar.css'
import SlotMachine from '../assets/slot-machine-svgrepo-com.svg'


const NavBar = () => {
    
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const loadUser = () => {
          try {
            const saved = JSON.parse(localStorage.getItem("user") || "{}");
            setUsername(saved.name || saved.email || "");
          } catch {
            setUsername("");
          }
        };
    
        loadUser();
        window.addEventListener("storage", loadUser);
        return () => window.removeEventListener("storage", loadUser);
      }, []);

    
    const goHome = () => navigate('/');
    const logIn = () => navigate('/login');
    const createAccount = () => navigate('/createAccount');
    const about = () => navigate('/about')

    const handleLogout  = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUsername("");
        navigate("/");                        
    };

    return(
        <div className="nav-container">
            <h1 className="logo" onClick={goHome} style={{ cursor: "pointer" }}>
                <img src={SlotMachine} alt="" className='machine-icon'/>
                Gaming Edge
            </h1>

             <ul className='nav-list'>
                 <button className="home-button" onClick={goHome}>Home</button>
                 <button className="about-button" onClick={about}>About</button>

                 {username ? (
                    <>
                    <li className="welcome-msg">Welcome,&nbsp;{username}</li>
                    </>
                ) : (
                    <>
                    <button onClick={logIn}>Sign In</button>
                    <button onClick={createAccount}>Register</button>
                    </>
                 )}
             </ul>
         </div>
     );
 };

export default NavBar 