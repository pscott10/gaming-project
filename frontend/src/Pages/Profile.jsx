import React, {useState} from 'react'
import NavBar from '../components/NavBar'
import Sidebar from '../components/Sidebar'
import '../components/Profile.css'
import '../components/NavBar.css'
import CreateReportModal from '../components/CreateReportModal'
import CreateReport from '../components/CreateReport'
import Settings from '../Pages/Settings'
import LogOut from '../components/LogOut'
import settingIcon from '../assets/gear.svg'
import createIcon from '../assets/plus.svg'
import { useNavigate } from 'react-router-dom'

export function Profile() {
    const[isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const[isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    const[isLogOutOpen, setIsLogOutOpen] = useState(false);
    
    const openLogOut = () => setIsLogOutOpen(true);
    const closeLogOut = () => setIsLogOutOpen(false);


    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };


    return (
        <div className="profile-container">
             <div className="nav-container">
            
            <h1 className="logo">Gaming Edge</h1>
            <ul className='nav-list'>
                <button className="home-button" onClick={goHome}>Home</button>
                <button className="about-button">About</button>
                <button className="contact-button">Contact</button>
                <button className="register" onClick={openLogOut}>Logout</button>
            </ul>
            <CreateReportModal isOpen={isLogOutOpen} onClose={closeLogOut}>
            <LogOut />
            </CreateReportModal>
        </div>
            <div className="main-layout">
            <div className="sidebar-background">
        <div className="sidebar">
            <h1 className="profile">Profile</h1>
            <ul className='sidebar-list'>
                <button className="sidebar-button">Saved Reports</button>
                <button className="sidebar-button">History</button>
                <button className='sidebar-button' onClick={openSettings}>
                    <img src={settingIcon} alt="" className='setting-icon'/>
                    Settings
                    </button>
            </ul>
            <CreateReportModal isOpen={isSettingsOpen} onClose={closeSettings}>
            <Settings />
            </CreateReportModal>
        </div>
        
    </div>
                <div className="profile-content">
                    <div className="profile-header">
                        <div className="header-left">
                        <ul className='savedreports-header'>Saved Reports </ul>
                        <button className='create-report' onClick={openModal}>
                        <img src={createIcon} alt="" className='create-icon'/>
                            Create Report</button>
                        </div>
                        <button className="report-list">Report 1</button>
                    </div>
                </div>
            </div>
            <CreateReportModal isOpen={isModalOpen} onClose={closeModal}>
                <CreateReport />
            </CreateReportModal>
        </div>
    )
}
export default Profile
