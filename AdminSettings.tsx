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

const AdminSettings = () => {


    useEffect(() => {
        document.title = 'Settings - HydroClean';
    }, []);

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [formUsername, setFormUsername] = useState('');
    const [goodLevelTime, setGoodLevelTime] = useState<string | null>(null);
    const [dangerLevelTimes, setDangerLevelTimes] = useState<string[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [selectedReason, setSelectedReason] = useState(''); // Track dropdown selection
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isDeactivatePopupOpen, setIsDeactivatePopupOpen] = useState(false);
    const [customReason, setCustomReason] = useState('');

    const handleDeleteAccount = () => {
        setIsDeletePopupOpen(true);
    };

    const handleDeactivateAccountClick = () => {
        setIsDeactivatePopupOpen(true);
    };


    const handleReasonChange = (e) => {
        const selected = e.target.value;
        setSelectedReason(selected);

        // Clear the reason field when "Other" is selected
        if (selected !== 'Others') {
            setReason(selected);
        } else {
            setReason('');
        }
    };




    const handleReasonSubmit = async () => {
        // Check if reason is provided
        if (!reason.trim() && selectedReason === 'Others') {
            Swal.fire("Error!", "Please provide a reason for deleting your account.", "error");
            return;
        }

        try {
            // Retrieve logged-in user details
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
            if (!loggedInUser.email) {
                Swal.fire("Error!", "No user data found. Please log in again.", "error");
                return;
            }

            // Request data
            const requestData = {
                email: loggedInUser.email,
                reason: reason || selectedReason, // Use dropdown reason or custom reason
            };

            // Send request to server for deletion
            const response = await axios.post("http://localhost/hydroclean/delete_confirmation.php", requestData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.status === 'success') {
                Swal.fire({
                    title: "Request Sent",
                    text: "Your account deletion request has been sent to the Department Manager.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                setIsDeletePopupOpen(false);
                setReason('');
                setSelectedReason('');
            } else {
                Swal.fire("Error!", response.data.message || 'Failed to send your deletion request.', "error");
            }
        } catch (error) {
            Swal.fire("Error!", "There was an issue sending your deletion request. Please try again.", "error");
            console.error("Error sending deletion request:", error);
        }
    };





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

    const handleSubmit = async () => {
        // Validate password length only if provided
        if (Password && Password.length < 8) {
            Swal.fire("Error!", "Password must be at least 8 characters long.", "error");
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        const requestData = { email: loggedInUser.email };

        let updateMessage = ""; // Initialize message for updates
        let navigateToLogin = false; // Flag to determine navigation

        // Check and add username to the request
        if (formUsername) {
            requestData.username = formUsername;
            updateMessage = "Username updated successfully";
        }

        // Check and add password to the request
        if (Password || confirmPassword) {
            if (Password === confirmPassword) {
                requestData.password = Password;
                updateMessage = updateMessage
                    ? "Username and password updated successfully"
                    : "Password updated successfully";
                navigateToLogin = true; // Password update requires login
            } else {
                Swal.fire("Error!", "Passwords do not match.", "error");
                return;
            }
        }

        // Ensure at least one field (username or password) is provided
        if (!formUsername && !Password) {
            Swal.fire("Error!", "Please provide a username or password to update.", "error");
            return;
        }

        try {
            const response = await axios.post("http://localhost/hydroclean/update_profile.php", requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Show success message for username update first
                if (formUsername && !navigateToLogin) {
                    Swal.fire({
                        title: "Success!",
                        text: "Username updated successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        // Navigate to dashboard after popup
                        navigate('/admindashboard');
                    });
                }

                // For password or both username and password updates
                if (navigateToLogin) {
                    Swal.fire({
                        title: "Success!",
                        text: updateMessage,
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        // Navigate to login after popup
                        navigate('/login');
                    });
                }

                // Update localStorage and state if username is updated
                if (formUsername) {
                    const updatedUser = { ...loggedInUser, username: formUsername };
                    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                    setUsername(updatedUser.username);
                    setFormUsername('');
                }

                // Clear password fields
                setPassword('');
                setConfirmPassword('');
            } else {
                Swal.fire("Error!", response.data.message || 'Unable to update profile.', "error");
            }
        } catch (error) {
            Swal.fire("Error!", "There was an issue updating your profile. Please try again.", "error");
        }
    };


    const handleDeactivateAccount = async () => {
        // Check if reason is provided
        if (!reason.trim() && selectedReason === 'Others') {
            Swal.fire("Error!", "Please provide a reason for deactivating your account.", "error");
            return;
        }

        try {
            // Retrieve logged-in user details
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
            if (!loggedInUser.email) {
                Swal.fire("Error!", "No user data found. Please log in again.", "error");
                return;
            }

            // Request data
            const requestData = {
                email: loggedInUser.email,
                reason: reason || selectedReason, // Use dropdown reason or custom reason
            };

            // Send request to server for deletion
            const response = await axios.post("http://localhost/hydroclean/deactivate_user.php", requestData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.status === 'success') {
                Swal.fire({
                    title: "Request Sent",
                    text: "Your account deactivation request has been sent to the Department Manager.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                setIsDeletePopupOpen(false);
                setReason('');
                setSelectedReason('');
            } else {
                Swal.fire("Error!", response.data.message || 'Failed to send your deactivation request.', "error");
            }
        } catch (error) {
            Swal.fire("Error!", "There was an issue sending your deactivation request. Please try again.", "error");
            console.error("Error sending deletion request:", error);
        }
    };



    return (
        <>
            <header className="top-banner">
                <img src={headerImage} alt="Header" className="header-image" />
                <p>A Capstone Project at Colegio de San Juan de Letran Calamba in collaboration with the Calamba Water District | Telephone Nos: (049) 545-1614 | 545-2863 | 545-2728 | 545-7895</p>
            </header>

            <title>Settings</title>

            <div className="container">
                <Sidebar items={[
                    { icon: "dashboard", label: "Dashboard", href: "admindashboard" },
                    { icon: "receipt_long", label: "History", href: "adminhistory" },
                    { icon: "settings", label: "Settings", active: true, href: "adminsettings" },
                    { icon: "logout", label: "Logout", href: "login" }
                ]} />

                <main>
                    <h1>Settings</h1>
                    <p>Update your profile</p>

                    <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
                        <div className="flex">
                            <div className="inputBox">
                                <label>Email:</label>
                                <p className="action">{Email}</p>

                                <label>Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formUsername}
                                    onChange={(e) => setFormUsername(e.target.value)}
                                    placeholder="Enter your Username"
                                    className="box"
                                />
                            </div>
                        </div>

                        <div className="password-section">
                            <label>New password:</label>
                            <input
                                type="password"
                                id="new_pass"
                                name="new_pass"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="box"
                            />

                            <label>Confirm password:</label>
                            <input
                                type="password"
                                id="confirm_pass"
                                name="confirm_pass"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="box"
                            />
                        </div>

                        <button type="submit" onClick={handleSubmit} className="btn">Update Profile</button>

                        <div className="action-buttons">
                            <button type="button" onClick={handleDeactivateAccountClick} className="deactivate-account">
                                Deactivate Account
                            </button>
                        </div>

                        {isDeactivatePopupOpen && (
                            <div className="deactivate-popup">
                                <h3>Please select a reason for account deactivation:</h3>
                                <select
                                    value={selectedReason}
                                    onChange={handleReasonChange}
                                    className="reason-dropdown"
                                >
                                    <option value="">-- Select a reason --</option>
                                    <option value="On leave">On leave</option>
                                    <option value="Account Inactivity">Account Inactivity</option>
                                    <option value="Others">Others</option>
                                </select>

                                {selectedReason === 'Others' && (
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Enter your reason here..."
                                        rows="4"
                                        className="reason-textarea"
                                    ></textarea>
                                )}

                                <div className="popup-buttons">
                                    <button onClick={handleDeactivateAccount} className="btn btn-danger">
                                        Submit Request
                                    </button>
                                    <button
                                        onClick={() => setIsDeactivatePopupOpen(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="action-buttons">
                            <button type="button" onClick={handleDeleteAccount} className="delete-account">
                                Delete Account
                            </button>
                        </div>

                        {isDeletePopupOpen && (
                            <div className="delete-popup">
                                <h3>Please provide a reason for account deletion:</h3>
                                <select
                                    value={selectedReason}
                                    onChange={handleReasonChange}
                                    className="reason-dropdown"
                                >
                                    <option value="">-- Select a reason --</option>
                                    <option value="Retired">Retired</option>
                                    <option value="Resignation">Resignation</option>
                                    <option value="Change in job role">Change in job role</option>
                                    <option value="Termination of employment">Termination of employment</option>
                                    <option value="Others">Others</option>
                                </select>

                                {selectedReason === 'Others' && (
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Enter your reason here..."
                                        rows="4"
                                        className="reason-textarea"
                                    ></textarea>
                                )}

                                <button onClick={handleReasonSubmit} className="btn btn-danger">Submit Request</button>
                                <button onClick={() => setIsDeletePopupOpen(false)} className="btn btn-secondary">Cancel</button>
                            </div>
                        )}
                    </form>


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
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSettings;