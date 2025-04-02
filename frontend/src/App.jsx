import './App.css'
import React from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import {Home} from './Pages/Home'
import {CreateAccount} from './Pages/CreateAccount'
import {Login} from './Pages/Login'
import {Profile} from './Pages/Profile'

function App(){
  return(
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/createAccount" element={<CreateAccount/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  )
}
export default App


/* import React from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom';
import CreateAccount from './Pages/CreateAccount'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Sidebar from './components/Sidebar'
import Home from './Pages/Home'


const App = () => {
 
  //   return (
  //    <div>
  //       {/* <Profile/> */
  //      {/* <CreateAccount/> */}
  //      <Home/>
  //    </div>
  //  ) 

 