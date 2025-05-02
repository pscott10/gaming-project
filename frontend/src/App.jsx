import './App.css'
import React, { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import {Home} from './pages/Home'
import {CreateAccount} from './pages/CreateAccount'
import {Login} from './pages/Login'
import Profile from './pages/Profile'
import Charts from './pages/Charts'
import CreateReport from './components/CreateReport';
import ReportTable from './pages/ReportTable';
import CreateReportModal from './components/CreateReportModal';
import About from './pages/About'; 
import History from './pages/History';
import Tools from './pages/Tools';

function App(){

  const [theme, setTheme] = useState('light');

  return(
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/createAccount" element={<CreateAccount/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/createReport" element={<CreateReport />} />
      <Route path="/report/:id" element={<ReportTable/>} />
      <Route path="/createReportModal" element={<CreateReportModal/>} />
      <Route path="/charts" element={<Charts/>} />
      <Route path="/history" element={<History/>} />
      <Route path="/tools" element={<Tools/>} />
      </Routes>
  );
}
export default App


 