import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Register() {
    const [Username, setUsername] = useState('');
    const [Firstname, setFirstname] = useState('');
    const [Lastname, setLastname] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [Access_level, setAccessLevel] = useState('Water Quality Assurance Dept.'); // Default value


    useEffect(() => {
        document.title = 'Register - HydroClean';
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Check if passwords match
        if (Password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Passwords do not match!",
                text: "Please enter the same password in both fields.",
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal2-popup swal2-centered',
                },
            });
            return;
        }

        if (Password.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Password Too Short!",
                text: "Password must be at least 8 characters long.",
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal2-popup swal2-centered',
                },
            });
            return;
        }

        try {
            const newUser = new URLSearchParams();
            newUser.append('username', Username);
            newUser.append('firstname', Firstname);
            newUser.append('lastname', Lastname);
            newUser.append('email', Email);
            newUser.append('password', Password);
            newUser.append('access_level', Access_level);

            const response = await axios.post("http://localhost/hydroclean/register.php", newUser, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data.success) {
                localStorage.setItem('access_level', Access_level);
                
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: "Thank you for signing up. Please check your email for a verification link to activate your account.",
                    position: 'center',
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: '#3085d6',
                    customClass: {
                        popup: 'swal2-popup swal2-centered',
                    },
                });

                setUsername('');
                setFirstname('');
                setLastname('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAccessLevel('Water Quality Assurance Dept.'); // Reset to default
            } else {
                // Handle errors returned from the server
                if (response.data.message.includes('username')) {
                    Swal.fire({
                        icon: "error",
                        title: "Username Already Exists!",
                        text: response.data.message || 'Please choose a different username.',
                        position: 'center',
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'swal2-popup swal2-centered',
                        },
                    });
                } else if (response.data.message.includes('email')) {
                    Swal.fire({
                        icon: "error",
                        title: "Email Already Exists!",
                        text: response.data.message || 'Please use a different email address.',
                        position: 'center',
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'swal2-popup swal2-centered',
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Registration Failed!",
                        text: response.data.message || 'Registration failed. Please try again.',
                        position: 'center',
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'swal2-popup swal2-centered',
                        },
                    });
                }
            }
        } catch (error) {
            console.error('Error registering user:', error);
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: 'An error occurred. Please try again later.',
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal2-popup swal2-centered',
                },
            });
        }
    };

    return (
        <>
            <title>Register</title>
            <main>
                <form className="intro-form" onSubmit={handleSubmit}>
                    <h1 className="intro-form-title">HydroClean</h1>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={Firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={Lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-select">
                        <label htmlFor="access_level">Access Level</label>
                        <select
                            name="access_level"
                            className="form-control"
                            value={Access_level}
                            onChange={(e) => setAccessLevel(e.target.value)}
                        >
                            <option value="Water Quality Assurance Dept.">Water Quality Assurance Dept.</option>
                            <option value="Department Manager"> Department Manager</option>
                        </select>
                    </div>
                    <button className='btn' type="submit">Register Now</button>
                    <p className="intro-bot-text">Have an account? <a href="/login" className='form-link-text'>Log in</a></p>
                </form>
            </main>
        </>
    );
}