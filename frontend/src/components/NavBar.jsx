import React from 'react';
import {useNavigate} from 'react-router-dom';
 import '../components/Navbar.css'
 import SlotMachine from '../assets/slot-machine-svgrepo-com.svg'


 const NavBar = () => {
    
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    const logIn = () =>{
        navigate('/login');
    }

    const createAccount = () =>{
        navigate('/createAccount');
    }

    const about = () =>{
        navigate('/about')
    }

    return(
        <div className="nav-container">
             <h1 className="logo"><img src={SlotMachine} alt="" className='machine-icon'/>
             Gaming Edge</h1>
             <ul className='nav-list'>
                 <button className="home-button" onClick={goHome}>Home</button>
                 <button className="about-button" onClick={about}>About</button>
                 <button className="sign_in" onClick={logIn}>Sign In</button>
                 <button className="register" onClick={createAccount}>Register</button>
             </ul>
         </div>
     )
 }
export default NavBar 