import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ForgotPassword() {

    useEffect(() => {
        document.title = 'Forgot Password - HydroClean';
    }, []);

    const [Email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost/hydroclean/forgot-password.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email }), // Only sending the Email
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reset Link Sent!',
                    text: 'Please check your email for the password reset link.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: result.message || 'Unable to send reset link. Please try again later.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'There was an error while sending the reset link. Please try again later.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    return (
        <main>
            <form className="intro-form" onSubmit={handleSubmit}>
                <h1 className="intro-form-title">Forgot Password</h1>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className="btn" type="submit">Send Reset Link</button>
                <p className="intro-bot-text">Remembered? <a href="/login" className="login-btn">Log in</a></p>
            </form>
        </main>
    );
}
