import React, {useState} from 'react'
import NavBar from '../components/NavBar'
import Sidebar from '../components/Sidebar'
import '../components/Profile.css'
import {Link} from 'react-router-dom'
import CreateReportModal from '../components/CreateReportModal'
import CreateReport from '../components/CreateReport'

export function Profile() {
    const[isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="profile-container">
            <NavBar />
            <div className="main-layout">
                <Sidebar />
                <div className="profile-content">
                    <div className="profile-header">
                        <div className="header-left">
                        <ul className='savedreports-header'>Saved Reports </ul>
                        <button className='create-report' onClick={openModal}>Create Report</button>
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
