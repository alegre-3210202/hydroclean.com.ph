import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Login() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');

    useEffect(() => {
        document.title = 'Login - HydroClean';
    }, []);

    useEffect(() => {
        // Set default mode to light
        localStorage.setItem('isDarkMode', 'false');

        const params = new URLSearchParams(window.location.search);
        const verified = params.get('verified');
        const error = params.get('error');

        if (verified) {
            Swal.fire({
                icon: 'success',
                title: 'Your account has been successfully verified!',
                text: 'You can now successfully log in.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        } else if (error) {
            let message = '';
            switch (error) {
                case 'invalid':
                    message = 'Invalid or already verified token.';
                    break;
                case 'update':
                    message = 'Error updating verification status.';
                    break;
                case 'missing':
                    message = 'Verification token missing.';
                    break;
                default:
                    message = 'An unknown error occurred.';
            }
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: message,
                confirmButtonText: 'OK',
            });
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost/hydroclean/login.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username, Password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const result = await response.json();

            if (result.success) {
                if (result.user) {
                    console.log("Login successful:", result.user);
                    const { user } = result;
                    localStorage.setItem('loggedInUser', JSON.stringify(user));

                    if (user.access_level === "Department Manager") {
                        window.location.href = '/dashboard';
                    } else if (user.access_level === "Water Quality Assurance Dept.") {
                        window.location.href = '/admindashboard';
                    }

                } 
                
                else if (result.message === 'You have already requested for reactivation. Please wait.') {
                    Swal.fire({
                        icon: 'info',
                        title: 'Request Pending',
                        text: result.message,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                }else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login failed!',
                        text: result.message || 'Login failed.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                }
            } else {
                if (result.message === 'Your account is inactive. Please request reactivation.') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Account Inactive!',
                        text: result.message,
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Request Reactivation',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    }).then(async (result) => {
                        if (result.isDismissed) {
                            // Send request to update status to "request for reactivation"
                            await requestReactivation();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login failed!',
                        text: result.message || 'Login failed. Please check your username and password.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'There was an error while logging in. Please try again.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    const requestReactivation = async () => {
        try {
            const response = await fetch("http://localhost/hydroclean/request_reactivation.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username }),
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reactivation Request Sent',
                    text: 'Your request for reactivation has been sent successfully.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error sending your reactivation request.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error while sending your reactivation request. Please try again.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    return (
        <main>
            <form className="intro-form" onSubmit={handleSubmit}>
                <h1 className="intro-form-title">HydroClean</h1>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="Username"
                        name="Username"
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="Password"
                        name="Password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='btn' type="submit">Login</button>
                <p className="intro-bot-text"><a href="/forgot-password" className='forgot-btn'>Forgot password?</a></p>
                <p className="intro-bot-text">No account? <a href="/register" className='register-btn'>Register now</a></p>
            </form>
        </main>
    );
}
