import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { server } from '../config';
import { getAPI } from '../components/Server';
import '../App.css';
import Sidebar from '../components/Sidebar';
import Popup from '../components/Popup';
import PercentageBlocks from '../components/PercentageBlocks';
import Comment from '../components/Comment';
import profileImage from '../assets/images/UserClean.png';
import logo from '../assets/images/hydro_logo.png';
import Darkmode from '../components/Darkmode';
import LineGraph from '../components/LineGraph';
import LineGraph2 from '../components/LineGraph2';
import headerImage from '../assets/images/header.png';

export default function Dashboard() {

    useEffect(() => {
        document.title = 'Dashboard - HydroClean';
    }, []);
    

    const [Email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [formUsername, setFormUsername] = useState('');
    const [goodLevelTime, setGoodLevelTime] = useState<string | null>(null);
    const [dangerLevelTimes, setDangerLevelTimes] = useState<string[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const accessLevel = localStorage.getItem('accessLevel');

    const fetchUsername = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            setUsername(user.username);
            setFormUsername(user.username);
            setEmail(user.email);
        } else {
            setUsername('Guest');
            setEmail('guest@example.com');
        }
    };

    useEffect(() => {
        document.title = 'Dashboard - HydroClean';
        fetchUsername();
    }, []);

    const fetchSensorData = async () => {
        try {
            const response = await fetch(getAPI(server, "HydroClean/hydroclen_data.php"));
            const data = await response.json();

            const goodLevel = data.filter((item: any) => item.turbidity < 5)
                .sort((a: any, b: any) => new Date(b.DateTime) - new Date(a.DateTime))[0];

            const dangerLevels = data.filter((item: any) => 
                (item.turbidity >= 1000 && item.turbidity <= 3000) ||
                (item.ph_level >= 0 && item.ph_level <= 1.99) ||
                item.ph_level >= 14 ||
                (item.tdsValue >= 1201 && item.tdsValue <= 3000) ||
                item.temperature_level > 40.1 ||
                (item.turbidity >= 5 && item.turbidity <= 999) ||
                (item.ph_level >= 2.00 && item.ph_level <= 5.99) ||
                (item.ph_level >= 9.01 && item.ph_level <= 13) ||
                (item.tdsValue >= 301 && item.tdsValue <= 1200) ||
                (item.temperature_level >= 0 && item.temperature_level <= 4.99) ||
                (item.temperature_level >= 34.00 && item.temperature_level <= 40.00)
            ).sort((a: any, b: any) => new Date(b.DateTime) - new Date(a.DateTime));

            if (goodLevel) {
                setGoodLevelTime(new Date(goodLevel.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' }));
            }

            if (dangerLevels.length > 0) {
                const dangerTimes = dangerLevels.map((level: any) => 
                    new Date(level.DateTime).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' })
                );
                setDangerLevelTimes(dangerTimes);
            }
        } catch (error) {
            console.error("Failed to fetch sensor data", error);
        }
    };

    useEffect(() => {
        fetchSensorData();
        const intervalId = setInterval(fetchSensorData, 10000); 
        return () => clearInterval(intervalId);
    }, []);

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    Popup(getAPI(server, "HydroClean/hydroclen_data.php"), 3000, 10000);

    const handleToggleSidebar = () => {
        const sidebarStatus = localStorage.getItem('sidebarOpen') === 'true' ? 'false' : 'true';
        localStorage.setItem('sidebarOpen', sidebarStatus);
    };

    const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            // navigate('/login');
        }
    }, []);

    return (
        <>

            <header className="top-banner">
                <img src={headerImage} alt="Header" className="header-image" />
                <p>A Capstone Project at Colegio de San Juan de Letran Calamba in collaboration with the Calamba Water District | Telephone Nos: (049) 545-1614 | 545-2863 | 545-2728 | 545-7895</p>
            </header>

            <title>Dashboard</title>

            <div className="container">
                <Sidebar items={[
                    { icon: "dashboard", label: "Dashboard", href: "dashboard", active: true },
                    { icon: "receipt_long", label: "History", href: "history" },
                    { icon: "report_gmailerrorred", label: "Intervention", href: "intervention" },
                    { icon: "person", label: "Employee Management", href: "employee" },
                    { icon: "settings", label: "Settings", href: "settings" },
                    { icon: "logout", label: "Logout", href: "login" }
                ]} />
                <main>
                    <h1>Dashboard</h1>
                    <div className="analyse">
                        <PercentageBlocks />
                    </div>

                    <LineGraph
                        url={getAPI(server, "HydroClean/hydroclen_data.php?sensor=turbidity&sensor=tds")}
                        title="Turbidity & TDS Metrics"
                        labels={["Date & Time", "Turbidity", "TDS"]}
                    />
                    <LineGraph2
                        url={getAPI(server, "HydroClean/hydroclen_data.php?sensor=ph&sensor=temperature")}
                        title="pH & Temperature Metrics"
                        labels={["Date & Time", "pH", "Temperature"]}
                    />

                </main>

                <div className="right-section">
                    <div className="nav">
                        <button id="menu-btn" onClick={handleToggleSidebar}>
                            <span className="material-icons-sharp">menu</span>
                        </button>

                        <Darkmode />

                        <div className="profile">
                            <div className="info">
                                <p>Hi <b>{username || 'Guest'}</b></p>
                                <small className="text-muted">{username ? 'Admin' : 'Guest'}</small>
                            </div>
                            <div className="profile-photo">
                                <img src={profileImage} alt="Profile" />
                            </div>
                        </div>
                    </div>

                    <div className="user-profile">
                        <div className="hydro_logo">
                            <img src={logo} alt="HydroClean Logo" />
                            <h2>HydroClean</h2>
                            <p>Real-time Alerts for a Cleaner Tomorrow</p>
                        </div>
                    </div>

                    <div className="reminders">
                        <div className="header">
                            <h2>Reports</h2>
                            <span className="material-icons-sharp" onClick={toggleNotification} style={{ cursor: 'pointer' }}>
                                {isNotificationOpen ? 'notifications_active' : 'notifications_none'}
                            </span>
                        </div>

                        {isNotificationOpen && (
    <div className={`notification-popup ${localStorage.getItem('isDarkMode') === 'true' ? 'dark-mode' : ''}`}>
        <div className="popup-header">
            <h3>Notifications</h3>
            <span className="material-icons-sharp close-icon" onClick={toggleNotification}>close</span>
        </div>
        <ul className="notification-list">
            {dangerLevelTimes.length > 0 ? (
                dangerLevelTimes.map((time, index) => (
                    <li key={index}>
                        <div className="icon">
                            <span className="material-icons-sharp">dangerous</span>
                        </div>
                        <div className="content">
                            <h4>Danger Level</h4>
                            <small>{time}</small>
                        </div>
                    </li>
                ))
            ) : (
                <li>
                    <div className="icon">
                        <span className="material-icons-sharp">dangerous</span>
                    </div>
                    <div className="content">
                        <h4>Danger Level</h4>
                        <small>No Data</small>
                    </div>
                </li>
            )}
        </ul>
    </div>
)}

                        <div className="notification">
                            <div className="icon">
                                <span className="material-icons-sharp">info</span>
                            </div>
                            <div className="content">
                                <div className="info">
                                    <h3>Good Level</h3>
                                    <small className="text-muted">{goodLevelTime ? goodLevelTime : "No Data"}</small>
                                </div>
                                <span className="material-icons-sharp">more_vert</span>
                            </div>
                        </div>

                        <div className="notification deactive">
                            <div className="icon">
                                <span className="material-icons-sharp">dangerous</span>
                            </div>
                            <div className="content">
                                <div className="info">
                                    <h3>Danger Level</h3>
                                    <small className="text-muted">{dangerLevelTimes.length ? dangerLevelTimes[0] : "No Data"}</small>
                                </div>
                                <span className="material-icons-sharp">more_vert</span>
                            </div>
                        </div>
                        <Comment />
                    </div>
                </div>
            </div>
        </>
    );
}