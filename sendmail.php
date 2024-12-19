<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

require 'vendor/autoload.php';

if (isset($_POST['submitMessage'])) {
    $message = $_POST['message'];

    // Validate the message (optional)
    if (empty($message)) {
        $_SESSION['status'] = "Message cannot be empty.";
        header("Location: {$_SERVER["HTTP_REFERER"]}");
        exit(0);
    }

    // Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);

    try {
        // Server settings
        //$mail->SMTPDebug = SMTP::DEBUG_SERVER; // Enable verbose debug output (uncomment for debugging)
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host = 'smtp.gmail.com';                           // Set the SMTP server to send through
        $mail->SMTPAuth = true;                                   // Enable SMTP authentication
        $mail->Username = 'phpmailer075@gmail.com';           // SMTP username
        $mail->Password = 'dkmsvufvvvnqnhcd';                    // SMTP password (consider using environment variables)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;      // Enable TLS encryption
        $mail->Port = 465;                                        // TCP port to connect to

        // Recipients
        $mail->setFrom('phpmailer075@gmail.com', 'Mailer');
        $mail->addAddress('andraealegre023@gmail.com', 'Mailer');         // Add a recipient

        // Content
        $mail->isHTML(true);                                      // Set email format to HTML
        $mail->Subject = 'Comment from AtmosClear';
        $mail->Body = '<h3>Hello, you received a comment!</h3>
                       <h4>Message: ' . htmlspecialchars($message) . '</h4>'; // Prevent XSS by escaping

        // Send the email
        if ($mail->send()) {
            $_SESSION['status'] = "Comment has been added.";
            header("Location: {$_SERVER["HTTP_REFERER"]}");
            exit(0);
        } else {
            $_SESSION['status'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            header("Location: {$_SERVER["HTTP_REFERER"]}");
            exit(0);
        }
    } catch (Exception $e) {
        $_SESSION['status'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        header("Location: {$_SERVER["HTTP_REFERER"]}");
        exit(0);
    }
} else {
    header('Location: comment.php');
    exit(0);
}
?>
