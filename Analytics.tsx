import { server } from '../config'
import { getAPI } from '../components/Server'

import DataTable from '../components/DataTable'
import PercentageBlock from '../components/PercentageBlock'
import Sidebar from '../components/Sidebar'

import profileImage from '../assets/images/user.png';
import logo from '../assets/images/HydroClean-logo.png';

export default function Analytics() {
    const handleToggleSidebar = () => {
        if (localStorage.getItem('sidebarOpen') === 'true') {
            localStorage.setItem('sidebarOpen', 'false');
        } else {
            localStorage.setItem('sidebarOpen', 'true');
        }
    };
    return (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />

            <title>Dashboard</title>

            <div className="container">
                {/* <!-- Sidebar Section --> */}
                <Sidebar items={[
                    { icon: "dashboard", label: "Dashboard", href: "dashboard", active: true },
                    { icon: "insights", label: "Analytics", href: "analytics" },
                    { icon: "receipt_long", label: "History", href: "history" },
                    { icon: "report_gmailerrorred", label: "Intervention", href: "intervention" },
                    { icon: "settings", label: "Settings", href: "settings" },
                    { icon: "logout", label: "Logout", href: "login" }
                ]} />
                {/* <!-- End of Sidebar Section --> */}

                {/* <!-- Main Content --> */}
                <main>
                    <h1>Analytics</h1>
                    {/* <!-- Analyses --> */}
                    <div className="analyse">
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
                        <div className="dark-mode">
                            <span className="material-icons-sharp active">
                                light_mode
                            </span>
                            <span className="material-icons-sharp">
                                dark_mode
                            </span>
                        </div>

                        <div className="profile">
                            <div className="info">
                                <p>Hey, <b>Jed</b></p>
                                <small className="text-muted">Admin</small>
                            </div>
                            <div className="profile-photo">
                                <img src={profileImage} />
                            </div>
                        </div>

                    </div>
                    {/* <!-- End of Nav --> */}

                    <div className="user-profile">
                        <div className="HydroClean-logo">
                            <img src={logo} />
                            <h2>HydroClean</h2>
                            <p>Real-time Alerts for a Cleaner Tomorrow</p>
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