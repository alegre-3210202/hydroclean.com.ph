import React, { useState } from 'react';
import Swal from 'sweetalert2';

const SendEmail: React.FC = () => {
    const [message, setMessage] = useState('');

    const handleSendEmail = async () => {
        const { value: userMessage } = await Swal.fire({
            input: 'textarea',
            inputLabel: "Enter message",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            }
        });

        if (userMessage) {
            setMessage(userMessage);

            try {
                const response = await fetch("http://localhost/AddComment/sendmail.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: userMessage
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                Swal.fire("Message Sent:", result.message);
            } catch (error: any) {
                console.error("There was an error sending the email!", error);
                Swal.fire("Error sending message", error.message, "error");
            }
        }
    };

    return (
        <>
            <div className="notification add-reminder">
                <div id='send-email' onClick={handleSendEmail}>
                    <span className="material-icons-sharp">
                        add
                    </span>
                    <h3>New Ticket</h3>
                </div>
            </div>
        </>
    );
};

export default SendEmail;