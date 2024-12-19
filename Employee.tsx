import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAPI } from '../components/Server';
import { server } from '../config';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import profileImage from '../assets/images/UserClean.png';
import logo from '../assets/images/hydro_logo.png';
import Darkmode from '../components/Darkmode';
import Comment from '../components/Comment';
import Popup from '../components/Popup';
import Swal from 'sweetalert2';
import headerImage from '../assets/images/header.png';

const Employee = () => {

    useEffect(() => {
        document.title = 'Employee Management - HydroClean';
    }, []);

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [formUsername, setFormUsername] = useState('');
    const [users, setUsers] = useState<any[]>([]); // Initialize users state as an array
    const [goodLevelTime, setGoodLevelTime] = useState<string | null>(null);
    const [dangerLevelTimes, setDangerLevelTimes] = useState<string[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    Popup(getAPI(server, "HydroClean/hydroclen_data.php"), 3000, 10000);


    useEffect(() => {
        fetchSensorData();
        const intervalId = setInterval(fetchSensorData, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            navigate('/login');
        }
    }, [navigate]);

    const handleToggleSidebar = () => {
        localStorage.setItem('sidebarOpen', localStorage.getItem('sidebarOpen') === 'true' ? 'false' : 'true');
    };

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost/HydroClean/user_management.php");
            const result = response.data; // Assuming the data is an array of users

            if (Array.isArray(result)) {
                // Map the user data to an array of structured users
                const validUsers = result.map((user: any) => ({
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    reason: user.reason,
                    status: user.status,
                }));

                setUsers(response.data);  // Update the state with the structured user data
            } else {
                console.error('Error: Response is not an array', result);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost/HydroClean/user_management.php");
                console.log(response.data); // Debugging
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);


    const handleRequestForDeletion = (username: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to delete the account of ${ username }.This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
        if (result.isConfirmed) {
            sendDeletionRequest(username);
        }
    });
};

const sendDeletionRequest = async (username: string) => {
    try {
        const response = await axios.post('http://localhost/HydroClean/delete_account.php', {
            action: 'deleteRequest',
            username,
        });
        if (response.data.success) {
            Swal.fire('Deleted!', 'The account has been deleted.', 'success');
            fetchData();
        } else {
            Swal.fire('Error!', response.data.message, 'error');
        }
    } catch (error) {
        Swal.fire('Error!', 'An error occurred. Please try again.', 'error');
    }
};



const handleRequestForReactivation = async (username: string) => {
    try {
        const response = await axios.post('http://localhost/HydroClean/reactivate_account.php', {
            action: 'reactivate',
            username: username
        });

        if (response.data.success) {
            Swal.fire({
                title: 'Success!',
                text: 'The account has been reactivated successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            fetchData(); // Refresh user data
        } else {
            Swal.fire({
                title: 'Error!',
                text: response.data.message || 'Failed to reactivate the account.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    } catch (error) {
        console.error('Error during reactivation:', error);
        Swal.fire({
            title: 'Error!',
            text: 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};

const handleDeactivateAccount = async (username: string) => {
    try {
        const response = await axios.post('http://localhost/HydroClean/deactivate_account.php', {
            action: 'deactivate',
            username: username
        });

        if (response.data.success) {
            Swal.fire({
                title: 'Success!',
                text: 'The account has been deactivated successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            fetchData(); // Refresh the user data
        } else {
            Swal.fire({
                title: 'Error!',
                text: response.data.message || 'Failed to deactivate the account.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    } catch (error) {
        console.error('Error during deactivation:', error);
        Swal.fire({
            title: 'Error!',
            text: 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};

return (
    <>
        <header className="top-banner">
            <img src={headerImage} alt="Header" className="header-image" />
            <p>A Capstone Project at Colegio de San Juan de Letran Calamba in collaboration with the Calamba Water District | Telephone Nos: (049) 545-1614 | 545-2863 | 545-2728 | 545-7895</p>
        </header>

        <title>Employee Account Management</title>

        <div className="container">
            <Sidebar items={[
                { icon: "dashboard", label: "Dashboard", href: "dashboard" },
                { icon: "receipt_long", label: "History", href: "history" },
                { icon: "report_gmailerrorred", label: "Intervention", href: "intervention" },
                { icon: "person", label: "Employee Management", active: true, href: "employee" },
                { icon: "settings", label: "Settings", href: "settings" },
                { icon: "logout", label: "Logout", href: "login" }
            ]} />

            <main>
                <h1>Employee Account Management</h1>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.email}</td>
                                <td>{user.reason}</td>
                                <td>{user.status}</td>
                                {user.status === 'request for deletion' && (
                                    <td>
                                        <button
                                            onClick={() => handleRequestForDeletion(user.username)}
                                            className="print-button custom-button" style={{ fontSize: '10px' }}>
                                            Delete Account
                                        </button>
                                    </td>
                                )}



                                {user.status === 'request for deactivation' && (
                                    <td>
                                        <button
                                            onClick={() => handleDeactivateAccount(user.username)}
                                            className="print-button custom-button" style={{ fontSize: '10px' }}>
                                            Deactivate Account
                                        </button>
                                    </td>
                                )}

                                {user.status === 'request for reactivation' && (
                                    <td>
                                        <button
                                            onClick={() => handleRequestForReactivation(user.username)}
                                            className="print-button custom-button" style={{ fontSize: '10px' }}>
                                            Reactivate Account
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </main>

            <div className="right-section">
                <div className="nav">
                    <button id="menu-btn" onClick={handleToggleSidebar}>
                        <span className="material-icons-sharp">menu</span>
                    </button>

                    <Darkmode />

                    <div className="profile">
                        <div className="info">
                            <p>Hello <b>{username || 'Guest'}</b></p>
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
};

export default Employee;