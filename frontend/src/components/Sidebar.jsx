import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import Settings from '../Pages/Settings';
import LogOut from '../components/LogOut';
import CreateReportModal from '../components/CreateReportModal'


function Sidebar() {

  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen]     = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const openLogOut = () => setIsLogOutOpen(true);
  const closeLogOut = () => setIsLogOutOpen(false);
    
        const recentReports = () => {
            navigate('/profile');
        };

        const history = () => {
          navigate('/history');
        }

        const charts = () => {
          navigate('/charts');
        }

    return (
        <div className="sidebar-background">
          <div className="sidebar">
            <h1 className="profile">Welcome, User</h1>
            <ul className="sidebar-list">
              <li><button className="sidebar-button" onClick={recentReports}>Recent Reports</button></li>
              <li><button className="sidebar-button" onClick={history}>History</button></li>
              <li><button className="sidebar-button" onClick={charts}>Charts &amp; Graphs</button></li>
              <li><button className="sidebar-button" onClick={openSettings}>Settings</button></li>
              <li><button className="sidebar-button" onClick={openLogOut}>Logout</button></li>
            </ul>
        <CreateReportModal isOpen={isSettingsOpen} onClose={closeSettings}>
        <Settings />
        </CreateReportModal>
        <CreateReportModal isOpen={isLogOutOpen} onClose={closeLogOut}>
        <LogOut />
      </CreateReportModal>
          </div>
          
        </div>
        
    );
}

export default Sidebar;