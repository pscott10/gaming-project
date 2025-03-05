import React from 'react';
import '../components/Navbar.css'

const NavBar = () => {
    return(
        <div className="nav-container">
            <h1 className="logo">🎮 Gaming Edge</h1>
            <ul>
                <button className="active">Products</button>
                <button>Home</button>
                <button>About</button>
                <button>Contact</button>
                <button className="sign-in">Sign in</button>
                <button className="register">Register</button>
            </ul>
        </div>
    )
}
export default NavBar