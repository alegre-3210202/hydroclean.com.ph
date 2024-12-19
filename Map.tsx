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
import logo from '../assets/images/logo.png';
import Darkmode from '../components/Darkmode';


export default function Dashboard() {

    Popup(getAPI(server, "HydroClean/hydroclen_data.php"), 3000);

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
        // if (!loggedInUser) {
        //     navigate('/login');
        // }
    }, []);

    return (
        <>
            <title>Dashboard</title>

            <div className={localStorage.getItem('isDarkMode') ? 'container dark-mode' : 'container'}>

                {/* <!-- Right Section --> */}
                <iframe className='map-embed'
                    src="https://www.iqair.com/air-quality-map?lat=14.288459777778&lng=121.01183316667&zoomLevel=6"
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', border: 0, minHeight: '108vh', top: -68 }}
                    allowFullScreen={false}
                    loading="lazy"
                ></iframe>

                <div className="right-section">
                    <div className="nav">
                        <button id="menu-btn" onClick={handleToggleSidebar}>
                            <span className="material-icons-sharp">
                                menu
                            </span>
                        </button>
                        <Darkmode />

                        <div className="profile">
                            <div className="info">
                                <p>{['Hey', 'Hi', 'Hello'][Math.floor(Math.random() * 3)]} <b>{localStorage.getItem('loggedInUser') ? (localStorage.getItem('loggedInUser') && JSON.parse(localStorage.getItem('loggedInUser') as string).Username) : ""}             </b></p>
                                <small className="text-muted">{localStorage.getItem('loggedInUser') ? "Admin" : "Guest"}</small>
                            </div>
                            <div className="profile-photo">
                                <img src={profileImage} />
                            </div>
                        </div>

                    </div>
                </div>
                {/* <!-- End of Nav --> */}
            </div>
        </>
    );
}
