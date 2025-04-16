import React from 'react'
import '../components/Home.css'
import {Link, useNavigate} from 'react-router-dom'
import Moon from '../assets/moon-fill.svg'
import Sun from '../assets/moon.svg'
import DarkMode from '../components/DarkMode'
import NavBar from '../components/NavBar'

export function Home() {

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

    return (
        <>
        <div className= "home-container">
            <NavBar />
            <div className="header2">
                <div className="logo2">Gaming Edge</div>
                <DarkMode />
            </div>
            <div className="buttons">
                <ul className='home-list'>
                    <button className="active" onClick={logIn}>Sign In</button>
                    <button className="active" onClick={createAccount}>Create an Account</button>
                </ul>
            </div>
        </div>
        </>
    )
}
