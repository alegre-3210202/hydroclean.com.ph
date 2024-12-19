import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { server } from '../config'
import { getAPI } from '../components/Server'
import '../App.css'

import DataTable from '../components/DataTable'
import Sidebar from '../components/Sidebar'
import Popup from '../components/Popup';
import PercentageBlocks from '../components/PercentageBlocks'


import profileImage from '../assets/images/user.png';
import logo from '../assets/images/hydro_logo.png';
import Darkmode from '../components/Darkmode';
import SendEmail from '../components/SendEmail';


export default function Dashboard() {
    const [goodLevelTime, setGoodLevelTime] = useState<string | null>(null);
    const [dangerLevelTime, setDangerLevelTime] = useState<string | null>(null);

    const fetchSensorData = async () => {
        try {
            const response = await fetch(getAPI(server, "HydroClean/hydroclen_data.php"));
            const data = await response.json();

            // Assuming your API returns an array of data with turbidity and datetime fields
            const goodLevel = data.filter((item: any) => item.turbidity < 5).sort((a: any, b: any) => new Date(b.DateTime) - new Date(a.DateTime))[0];
            const dangerLevel = data.filter((item: any) => item.turbidity >= 5).sort((a: any, b: any) => new Date(b.DateTime) - new Date(a.DateTime))[0];

            if (goodLevel) {
                setGoodLevelTime(new Date(goodLevel.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
            }
            if (dangerLevel) {
                setDangerLevelTime(new Date(dangerLevel.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
            }
        } catch (error) {
            console.error("Failed to fetch sensor data", error);
        }
    };

    useEffect(() => {
        fetchSensorData();
    }, []);

    Popup(getAPI(server, "HydroClean/hydroclen_data.php"), 3000, 10000);

    const handleToggleSidebar = () => {
        if (localStorage.getItem('sidebarOpen') === 'true') {
            localStorage.setItem('sidebarOpen', 'false');
        } else {
            localStorage.setItem('sidebarOpen', 'true');
        }
    };

    const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            //navigate('/login');
        }
    }, []);

    return (
        <>
            <title>Dashboard</title>

            <div className={localStorage.getItem('isDarkMode') ? 'container dark-mode' : 'container'}>
                {/* Sidebar Section */}
                <Sidebar items={[
                    { icon: "dashboard", label: "Dashboard", href: "dashboard", active: true },
                    { icon: "receipt_long", label: "History", href: "history" },
                    { icon: "report_gmailerrorred", label: "Intervention", href: "intervention" },
                    { icon: "settings", label: "Settings", href: "settings" },
                    { icon: "logout", label: "Logout", href: "login" }
                ]} />
                {/* End of Sidebar Section */}

                {/* Main Content */}
                <main>
                    <h1>Dashboard</h1>
                    {/* Analyses */}
                    <div className="analyse">
                        <PercentageBlocks />
                    </div>
                    {/* End of Analyses */}

                    {/* Recent Data Table */}
                    <DataTable url={getAPI(server, "HydroClean/hydroclen_data.php")} className='recent-data' title='Data Log' maxRows={3} customNames={["Date & Time", "Turbidity", "pH", "TDS", "Temperature"]} />
                    {/* End of Recent Orders */}
                </main>
                {/* End of Main Content */}

                {/* Right Section */}
                <div className="right-section">
                    <div className="nav">
                        <button id="menu-btn" onClick={handleToggleSidebar}>
                            <span className="material-icons-sharp">menu</span>
                        </button>
                        <Darkmode />

                        <div className="profile">
                            <div className="info">
                                <p>{['Hey', 'Hi', 'Hello'][Math.floor(Math.random() * 3)]} <b>{localStorage.getItem('loggedInUser') ? (localStorage.getItem('loggedInUser') && JSON.parse(localStorage.getItem('loggedInUser') as string).Username) : ""}</b></p>
                                <small className="text-muted">{localStorage.getItem('loggedInUser') ? "Admin" : "Guest"}</small>
                            </div>
                            <div className="profile-photo">
                                <img src={profileImage} />
                            </div>
                        </div>

                    </div>
                    {/* End of Nav */}

                    <div className="user-profile">
                        <div className="hydro_logo">
                            <img src={logo} />
                            <h2>HydroClean</h2>
                            <p>Real-time Alerts for a Cleaner Tomorrow</p>
                            <p className="credits">Water is life in Calamba Water District</p>
                        </div>
                    </div>

                    <div className="reminders">
                        <div className="header">
                            <h2>Reports</h2>
                            <span className="material-icons-sharp">notifications_none</span>
                        </div>

                        <div className="notification">
                            <div className="icon">
                                <span className="material-icons-sharp">info</span>
                            </div>
                            <div className="content">
                                <div className="info">
                                    <h3>Good Level</h3>
                                    <small className="text_muted">
                                        {goodLevelTime ? goodLevelTime : "No Data"}
                                    </small>
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
                                    <small className="text_muted">
                                        {dangerLevelTime ? dangerLevelTime : "No Data"}
                                    </small>
                                </div>
                                <span className="material-icons-sharp">more_vert</span>
                            </div>
                        </div>

                        <SendEmail />

                    </div>

                </div>


            </div>
        </>
    );
}