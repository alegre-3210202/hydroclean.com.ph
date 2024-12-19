import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { server } from '../config'
import { getAPI } from '../components/Server'
import '../App.css'

import Sidebar from '../components/Sidebar'
import Popup from '../components/Popup';


import profileImage from '../assets/images/user.png';
import logo from '../assets/images/logo.png';
import Darkmode from '../components/Darkmode';


export default function Risks() {
    Popup(getAPI(server, "hydroClean/hydroclen_data.php"), 3000);

    const handleToggleSidebar = () => {
        if (localStorage.getItem('sidebarOpen') === 'true') {
            localStorage.setItem('sidebarOpen', 'false');
        } else {
            localStorage.setItem('sidebarOpen', 'true');
        }
    };

    // const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        // if (!loggedInUser) {
        //     navigate('/login');
        // }
    }, []);

    return (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />

            <title>Health Risks</title>

            <div className={localStorage.getItem('isDarkMode') ? 'container dark-mode' : 'container'}>
                {/* <!-- Sidebar Section --> */}
                <Sidebar items={[
                    { icon: "dashboard", label: "Dashboard", href: "dashboard" },
                    { icon: "receipt_long", label: "History", href: "history" },
                    { icon: "report_gmailerrorred", label: "Health Risk", href: "risks", active: true },
                    { icon: "settings", label: "Settings", href: "settings" },
                    { icon: "logout", label: "Logout", href: "login" }
                ]} />
                {/* <!-- End of Sidebar Section --> */}

                {/* <!-- Main Content --> */}
                <main>
                    <h1>Health Risks</h1>
                    <div className="intervention-container">
                        <div className="intervention-card">
                            <div className="intervention-header"><p>Intervention Level 1</p></div>
                            <div className="intervention-body">
                                <p className="action"><b>Action</b>: No intervention needed. Air quality is healthy for all.</p>
                                <p className="school">School Suspension: No.</p>
                                <p className="car">Car Usage: No restrictions.</p>
                                <p className="mask">Mask Use: Not required.</p>
                                <div className="age-group"><b>Ages 14 below</b>:</div>
                                <p className="impact">None</p>
                                <div className="age-group"><b>Ages 18 to 44</b>:</div>
                                <p className="impact">None</p>
                                <div className="age-group">Ages 60 above:</div>
                                <p className="impact">None</p>
                            </div>
                        </div>

                        <div className="intervention-card">
                            <div className="intervention-header">Intervention Level 2</div>
                            <div className="intervention-body">
                                <p className="action">Action: Sensitive groups should limit prolonged outdoor activities.</p>
                                <p className="school">School Suspension: No.</p>
                                <p className="car">Car Usage: No restrictions.</p>
                                <p className="mask">Mask Use: Not required, but optional for sensitive groups.</p>
                                <div className="age-group">Ages 14 below:</div>
                                <p className="impact">Can trigger asthma and allergy rhinitis</p>
                                <div className="age-group">Ages 18 to 44:</div>
                                <p className="impact">Can cause bronchitis and lung cancer</p>
                                <div className="age-group">Ages 60 above:</div>
                                <p className="impact">Can cause shortness of breath</p>
                            </div>
                        </div>

                        <div className="intervention-card">
                            <div className="intervention-header">Intervention Level 3</div>
                            <div className="intervention-body">
                                <p className="action">Action: Sensitive groups (children, elderly, and people with pre-existing conditions) should avoid strenuous outdoor activities.</p>
                                <p className="school">School Suspension: No, but consider excusing sensitive students.</p>
                                <p className="car">Car Usage: No restrictions.</p>
                                <p className="mask">Mask Use: Optional for sensitive individuals.</p>
                                <div className="age-group">Ages 14 below:</div>
                                <p className="impact">Can cause pneumonia</p>
                                <div className="age-group">Ages 18 to 44:</div>
                                <p className="impact">Can cause heart attack and high blood pressure</p>
                                <div className="age-group">Ages 60 above:</div>
                                <p className="impact">Can cause difficulty breathing, flare-ups of asthma, and other lung problems</p>
                            </div>
                        </div>

                        <div className="intervention-card">
                            <div className="intervention-header">Intervention Level 4</div>
                            <div className="intervention-body">
                                <p className="action">Action: General population should reduce outdoor activities. Sensitive groups should avoid outdoor exposure entirely.</p>
                                <p className="school">School Suspension: No, but outdoor activities should be restricted.</p>
                                <p className="car">Car Usage: Minimize; encourage public transport.</p>
                                <p className="mask">Mask Use: Recommended for sensitive groups.</p>
                                <div className="age-group">Ages 14 below:</div>
                                <p className="impact">Can cause airborne allergens like pollen and dust mites</p>
                                <div className="age-group">Ages 18 to 44:</div>
                                <p className="impact">Can cause hypertension and stroke</p>
                                <div className="age-group">Ages 60 above:</div>
                                <p className="impact">Can cause Chronic Obstructive Pulmonary Disease</p>
                            </div>
                        </div>

                        <div className="intervention-card">
                            <div className="intervention-header">Intervention Level 5</div>
                            <div className="intervention-body">
                                <p className="action">Action: All individuals should avoid outdoor activities. Stay indoors as much as possible.</p>
                                <p className="school">School Suspension: Yes, especially for outdoor activities.</p>
                                <p className="car">Car Usage: Minimize to essential use only.</p>
                                <p className="mask">Mask Use: Mandatory for everyone when outdoors or in areas with poor indoor ventilation.</p>
                                <div className="age-group">Ages 14 below:</div>
                                <p className="impact">Increased respiratory infections like acute rhinosinusitis</p>
                                <div className="age-group">Ages 18 to 44:</div>
                                <p className="impact">Can increase tension due to hypertension</p>
                                <div className="age-group">Ages 60 above:</div>
                                <p className="impact">Can worsen certain diseases</p>
                            </div>
                        </div>

                        <div className="intervention-card">
                            <div className="intervention-header">Intervention Level 6</div>
                            <div className="intervention-body">
                                <p className="action">Action: Emergency conditions. Stay indoors, avoid all outdoor exposure.</p>
                                <p className="school">School Suspension: Yes. Schools should close.</p>
                                <p className="car">Car Usage: Only for emergencies.</p>
                                <p className="mask">Mask Use: Mandatory for all, including indoors if air quality is poor or unfiltered.</p>
                                <div className="age-group">Ages 14 below:</div>
                                <p className="impact">Premature death</p>
                                <div className="age-group">Ages 18 to 44:</div>
                                <p className="impact">Premature death</p>
                                <div className="age-group">Ages 60 above:</div>
                                <p className="impact">Premature death</p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- End of Analyses --> */}
                </main>
                {/* <!-- End of Main Content --> */}

                {/* <!-- Right Section --> */}
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
                                <p>{['Hey', 'Hi', 'Hello'][Math.floor(Math.random() * 3)]}, <b>{(localStorage.getItem('loggedInUser') && JSON.parse(localStorage.getItem('loggedInUser') as string).Username) || "Guest"}
                                </b></p>
                                <small className="text-muted">Admin</small>
                            </div>
                            <div className="profile-photo">
                                <img src={profileImage} />
                            </div>
                        </div>

                    </div>
                    {/* <!-- End of Nav --> */}

                    <div className="user-profile">
                        <div className="logo">
                            <img src={logo} />
                            <h2>AtmosClear</h2>
                            <p>Purifying the Air, One Breath at a Time</p>
                        </div>
                    </div>

                    <div className="reminders">
                        <div className="header">
                            <h2>Reports</h2>
                            <span className="material-icons-sharp">
                                notifications_none
                            </span>
                        </div>

                        <div className="notification">
                            <div className="icon">
                                <span className="material-icons-sharp">
                                    info
                                </span>
                            </div>
                            <div className="content">
                                <div className="info">
                                    <h3>Good AQI</h3>
                                    <small className="text_muted">
                                        11:00 AM
                                    </small>
                                </div>
                                <span className="material-icons-sharp">
                                    more_vert
                                </span>
                            </div>
                        </div>

                        <div className="notification deactive">
                            <div className="icon">
                                <span className="material-icons-sharp">
                                    dangerous
                                </span>
                            </div>
                            <div className="content">
                                <div className="info">
                                    <h3>High AQI</h3>
                                    <small className="text_muted">
                                        10:00 AM
                                    </small>
                                </div>
                                <span className="material-icons-sharp">
                                    more_vert
                                </span>
                            </div>
                        </div>

                        <div className="notification add-reminder">
                            <div>
                                <span className="material-icons-sharp">
                                    add
                                </span>
                                <h3>New Ticket</h3>
                            </div>
                        </div>

                    </div>

                </div>


            </div>
        </>
    )
}