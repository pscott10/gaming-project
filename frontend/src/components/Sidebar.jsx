import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import Settings from '../Pages/Settings';
import CreateReportModal from '../components/CreateReportModal'


function Sidebar() {

  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
    
        const recentReports = () => {
            navigate('/profile');
        };

        const history = () => {
          navigate('/history');
        }

        const charts = () => {
          navigate('/charts');
        }
        
        const logOut = () => {
          navigate('logout');
        }

    return (
        <div className="sidebar-background">
          <div className="sidebar">
            <h1 className="profile">Welcome, User</h1>
            <ul className="sidebar-list">
              <li><button className="sidebar-button" onClick={recentReports}>Profile</button></li>
              <li><button className="sidebar-button" onClick={history}>History</button></li>
              <li><button className="sidebar-button" onClick={charts}>Charts &amp; Graphs</button></li>
              <li><button className="sidebar-button" onclick={openSettings}>Settings</button></li>
              <li><button className="sidebar-button" onClick={logOut}>Logout</button></li>
            </ul>
            
          </div>
          <CreateReportModal isOpen={isSettingsOpen} onClose={closeSettings}>
        <Settings />
        </CreateReportModal>
        </div>
        
    );
}

export default Sidebar;