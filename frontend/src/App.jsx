import './App.css'
import React, { useState } from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import {Home} from './Pages/Home'
import {CreateAccount} from './pages/CreateAccount'
import {Login} from './pages/Login'
import {Profile} from './pages/Profile'
import Charts from './pages/Charts'
import CreateReport from './components/CreateReport';
import ReportTable from './pages/ReportTable';
import CreateReportModal from './components/CreateReportModal'


function App(){

  const [theme, setTheme] = useState('light');
  return(
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
     <Route path="/createAccount" element={<CreateAccount/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/createReport" element={<CreateReport />} />
      <Route path="/report/:id" element={<ReportTable/>} />
      <Route path="/createReportModal" element={<CreateReportModal/>} />
      <Route path="/charts" element={<Charts/>} />
      </Routes>
    </Router>
  )
}
export default App


 