import React from 'react';
 import '../components/Navbar.css'

 const NavBar = () => {
     return(
         <div className="nav-container">
             <h1 className="logo">Gaming Edge</h1>
             <ul>
                 <button>Home</button>
                 <button>About</button>
                 <button>Contact</button>
                 <button className="register">Log Out</button>
             </ul>
         </div>
     )
 }
export default NavBar 