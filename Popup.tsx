import { useEffect, useState } from 'react';
import fetchData from './GetData';
import Swal from 'sweetalert2';
import checkWaterQuality from './WaterQuality';

export default function Popup(url: string, refreshInterval = 5000, alertCooldown = 90000) { // alertCooldown is in milliseconds
    const [lastAlertTime, setLastAlertTime] = useState(0);

    useEffect(() => {
        async function checkAlert() {
            const data = await fetchData(url);

            if (!data || data.length === 0) return; // Check if there's any data

            const latestData = data[data.length - 1];
            const WaterQualityList = {
                turbidity: latestData.turbidity,
                ph_level: latestData.ph_level,
                tdsValue: latestData.tdsValue,
                temperature_level: latestData.temperature_level,
            };

            let type = checkWaterQuality(WaterQualityList);
            const currentTime = Date.now(); // Get current timestamp in milliseconds

            // Check if enough time has passed since the last alert
            if (currentTime - lastAlertTime < alertCooldown) {
                return; // Do not show alert if within cooldown period
            }

            // Update the lastAlertTime to current time if an alert is going to be shown
            let alertPromise;

            switch (type) {
                case 1: // Excellent
                    alertPromise = Swal.fire({
                        icon: "success",
                        title: "Excellent for drinking",
                        text: "Water quality meets all safe drinking water standards. No health risks identified.",
                        position: 'top-end', // Show at the top-right corner
                        toast: true, // Make it a toast-style alert
                        showConfirmButton: false, // Hide the confirm button
                        timer: 10000, // Auto-close after 5 seconds
                        timerProgressBar: true,
                        showCloseButton: true, // Show exit "X" button
                    });
                    break;
                case 2: // Good
                    alertPromise = Swal.fire({
                        icon: "success",
                        title: "Good",
                        text: "Water quality is good. No immediate health risks.",
                        position: 'top-end', // Show at the top-right corner
                        toast: true, // Make it a toast-style alert
                        showConfirmButton: false, // Hide the confirm button
                        timer: 10000, // Auto-close after 5 seconds
                        timerProgressBar: true,
                        showCloseButton: true, // Show exit "X" button
                    });
                    break;
                case 3: // Moderate
                    alertPromise = Swal.fire({
                        icon: "success",
                        title: "Moderate",
                        text: "Water quality is acceptable but not ideal. No immediate health risks, though caution is advised.",
                        position: 'top-end', // Show at the top-right corner
                        toast: true, // Make it a toast-style alert
                        showConfirmButton: false, // Hide the confirm button
                        timer: 10000, // Auto-close after 5 seconds
                        timerProgressBar: true,
                        showCloseButton: true, // Show exit "X" button
                        
                    });
                    break;
                case 4: // Unhealthy
                    alertPromise = Swal.fire({
                        icon: "warning",
                        title: "Unhealthy",
                        text: "Water quality is unhealthy. Please take immediate precautions.",
                        backdrop: `rgba(255, 102, 00, 0.2) left top no-repeat`,
                        showCloseButton: true, // Show exit "X" button
                    });
                    break;
                case 5: // Hazardous
                    alertPromise = Swal.fire({
                        icon: "error",
                        title: "Hazardous",
                        text: "Immediate action is required. Please avoid consuming, using, or distributing this water until the issue is fully resolved.",
                        backdrop: `rgba(153, 0, 51, 0.4) left top no-repeat`,
                        showCloseButton: true, // Show exit "X" button
                    });
                    break;
                case 6: //Default: Undefined / Error
                    alertPromise = Swal.fire({
                        icon: "error",
                        title: "Error: Water Quality Undefined",
                        text: "An unexpected error occurred while retrieving water quality data. Please try again or contact support.",
                        footer: '<a href="support">Contact Support</a>',
                        backdrop: `rgba(128, 128, 128, 0.4) left top no-repeat`, // Use a neutral color for error
                        position: 'center', // Display error alert at the center of the screen
                        showConfirmButton: true, // Keep confirm button to acknowledge the error
                    });
                    break;
                default:
                    return; // Exit if no valid alert type
            }

            // Handle the alert promise and update lastAlertTime
            alertPromise.then(() => {
                setLastAlertTime(Date.now()); // Update lastAlertTime after the alert is closed
            });
        }

        checkAlert();

        const intervalId = setInterval(checkAlert, refreshInterval); // Set up interval

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [url, refreshInterval, lastAlertTime, alertCooldown]);

    return null; // Return null since this component doesn't render anything
}
