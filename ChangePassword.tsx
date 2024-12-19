import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Change Password - HydroClean';
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const verificationToken = urlParams.get('token');
        const verified = urlParams.get('verified');

        if (verificationToken) {
            setToken(verificationToken);
        }

        if (verified === 'true') {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Email verified successfully. You can now reset your password.",
                confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
            });
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate Password Length
        if (Password.length < 8) {
            Swal.fire({
                title: "Password Too Short!",
                text: "Password must be at least 8 characters long.",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        // Check Password Match
        if (Password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Passwords do not match!",
                text: "Please enter the same password in both fields.",
            confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
                 });
            return;
        }

        try {
            const response = await axios.post("http://localhost/hydroclean/change-password.php", {
                token,
                Password,
                confirmPassword
            });

            console.log("Response:", response.data); // Log the full response for debugging
            if (response.data.success) {
                Swal.fire({
                    title: "Success!",
                    text: "Password changed successfully.",
                    icon: "success",
                    confirmButtonText:"OK",
                    confirmButtonColor: '#3085d6',
                    willClose: () => {
                        // Redirect to Login after the popup is closed
                        navigate('/login'); // Adjust the route according to your Login component's path
                    }
                });
                setPassword('');
                setConfirmPassword('');
            } else {
                Swal.fire("Error!", response.data.message || 'Unable to change password.', "error");
            }
        } catch (error) {
            console.error("Error updating password:", error); // Log the error

            // Check if error response exists
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error response data:", error.response.data); // Log error response data
                Swal.fire("Error!", error.response.data.message || "There was an error updating the password. Please try again later.", "error");
            } else {
                Swal.fire("Error!", "There was an error updating the password. Please try again later.", "error");
            }
        }
    };

    return (
        <main>
            <form className="intro-form" onSubmit={handleSubmit}>
                <h1 className="intro-form-title">Change Password</h1>
                <div className="form-group">
                    <label htmlFor="Password">New Password</label>
                    <input
                        type="password"
                        id="Password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="btn" type="submit">Change Password</button>
            </form>
        </main>
    );
}