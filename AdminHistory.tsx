import { useEffect, useState } from 'react';
import { server } from '../config';
import { getAPI } from '../components/Server';
import DataTable from '../components/DataTable';
import Sidebar from '../components/Sidebar';
import { isValidDate } from '../components/DateTime';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Darkmode from '../components/Darkmode';
import SendEmail from '../components/SendEmail';
import Popup from '../components/Popup';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import profileImage from '../assets/images/UserClean.png';
import logo from '../assets/images/hydro_logo.png';
import header from '../assets/images/cwdheader.png';
import Comment from '../components/Comment';
import headerImage from '../assets/images/header.png';
import '../App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataItem {
    dateTime: string;
    turbidity: number;
    ph_level: number;
    tdsValue: number;
    temperature_level: number;
}

export default function History() {

    useEffect(() => {
        document.title = 'History - HydroClean';
    }, []);
    
    const [Email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [formUsername, setFormUsername] = useState('');
    const [goodLevelTime, setGoodLevelTime] = useState<string | null>(null);
    const [dangerLevelTimes, setDangerLevelTimes] = useState<string[]>([]);  // Store multiple danger level times
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

            // Assuming your API returns an array of data with turbidity and datetime fields
            const goodLevel = data.filter((item: any) => item.turbidity < 5).sort((a: any, b: any) => new Date(b.DateTime) - new Date(a.DateTime))[0];

            // Filter for all dangerous levels (turbidity >= 5)
            const dangerLevels = data.filter((item: any) => 
                // Severe danger conditions
                (item.turbidity >= 1000 && item.turbidity <= 3000) ||
                (item.ph_level >= 0 && item.ph_level <= 1.99) ||
                item.ph_level >= 14 ||
                (item.tdsValue >= 1201 && item.tdsValue <= 3000) ||
                item.temperature_level > 40.1 ||
            
                // Moderate danger conditions
                (item.turbidity >= 5 && item.turbidity <= 999) ||
                (item.ph_level >= 2.00 && item.ph_level <= 5.99) ||
                (item.ph_level >= 9.01 && item.ph_level <= 13) ||
                (item.tdsValue >= 301 && item.tdsValue <= 1200) ||
                (item.temperature_level >= 0 && item.temperature_level <= 4.99) ||
                (item.temperature_level >= 34.00 && item.temperature_level <= 40.00)
            ).sort((a: any, b: any) => new Date(b.DateTime) - new Date(a.DateTime));

            // Set the latest good level time
            if (goodLevel) {
                setGoodLevelTime(new Date(goodLevel.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric'  }));
            }

            // Map danger levels to readable times and update the state
            if (dangerLevels.length > 0) {
                const dangerTimes = dangerLevels.map((level: any) => new Date(level.DateTime).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' }));
                setDangerLevelTimes(dangerTimes);
            }
        } catch (error) {
            console.error("Failed to fetch sensor data", error);
        }
    };

    useEffect(() => {
        fetchSensorData();
    }, []);

    Popup(getAPI(server, "HydroClean/hydroclen_data.php"), 3000, 10000);

    const handleToggleSidebar = () => {
        if (localStorage.getItem('sidebarOpen') === 'true') {
            localStorage.setItem('sidebarOpen', 'false');
        } else {
            localStorage.setItem('sidebarOpen', 'true');
        }
    };
    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const isDarkMode = localStorage.getItem('isDarkMode') === 'true'; // Check dark mode state
    const [data, setData] = useState<DataItem[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    const formattedEndDate = isNaN(adjustedEndDate.getTime()) 
        ? '' 
        : adjustedEndDate.toISOString().split('T')[0];

    useEffect(() => {
        
        const fetchData = async () => {
            if (!startDate || !formattedEndDate) return;

            try {
                const url = `${getAPI(server, "HydroClean/hydroclen_data.php")}?start_date=${startDate}&end_date=${formattedEndDate}`;
                const response = await fetch(url);
                const result = await response.json();
    
                if (Array.isArray(result)) {
                    const validData = result.map((item: any) => ({
                        dateTime: item.DateTime,
                        turbidity: parseFloat(item.turbidity),
                        ph_level: parseFloat(item.ph_level),
                        tdsValue: parseFloat(item.tdsValue),
                        temperature_level: parseFloat(item.temperature_level)
                    })).filter((item: any) => isValidDate(item.dateTime));
    
                    setData(validData);
                } else {
                    console.error('Error: Response is not an array', result);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };


        fetchData();
    }, [startDate, formattedEndDate]);

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    };

    const sortedData = [...data].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    const average = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const turbidityAvg = average(sortedData.map(item => item.turbidity));
    const phAvg = average(sortedData.map(item => item.ph_level));
    const tdsAvg = average(sortedData.map(item => item.tdsValue));
    const temperatureAvg = average(sortedData.map(item => item.temperature_level));


    const printToPDF = () => {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });
    
        // Load the image and add it to the PDF
        const imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGgAAAC/CAYAAACi/uq0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEa2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI0LTEwLTI5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjI8L0F0dHJpYjpFeHRJZD4KICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4KICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgPC9yZGY6bGk+CiAgIDwvcmRmOlNlcT4KICA8L0F0dHJpYjpBZHM+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+Y3dkaGVhZGVyIC0gMjwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9kYzp0aXRsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRv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'; // Ensure this path is correct
        const imgWidth = 580; // Set the width for the image
        const imgHeight = 100; // Set the height for the image
        const xPosition = 10; // X position to place the image
        const yPosition = 10; // Y position to place the image
    
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
    
        pdf.setFontSize(20);
        pdf.text('HydroClean Report', 20, 130); // Adjusted Y position after image
        pdf.setFontSize(14);
        pdf.text(`Data from ${startDate} to ${endDate}`, 20, 160); // Adjusted Y position after title
    
        // Create a table header
        const headers = [["Date & Time", "Turbidity", "pH", "TDS", "Temperature"]];
        
        // Prepare the data for the PDF
        const pdfData = sortedData.map(item => [
            item.dateTime,
            item.turbidity,
            item.ph_level,
            item.tdsValue,
            item.temperature_level
        ]);
    
        // Combine headers and data
        const tableData = headers.concat(pdfData);
        
        // Generate the table in the PDF
        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 180, // Start the table below the header and title
            theme: 'grid',
            styles: { overflow: 'linebreak', cellWidth: 'auto' },
            headStyles: {
                fillColor: [63, 81, 181], // Set your desired header color (RGB format)
                textColor: [255, 255, 255], // Set the text color for headers
                fontStyle: 'bold', // Make header text bold
            },
        });
    
        // Add averages to the PDF
        const averagesY = pdf.autoTable.previous.finalY + 20; // Position after the table
        pdf.setFontSize(12);
        pdf.text(`Average Turbidity: ${turbidityAvg.toFixed(2)}`, 20, averagesY);
        pdf.text(`Average pH: ${phAvg.toFixed(2)}`, 20, averagesY + 10);
        pdf.text(`Average TDS: ${tdsAvg.toFixed(2)}`, 20, averagesY + 20);
        pdf.text(`Average Temperature: ${temperatureAvg.toFixed(2)}°C`, 20, averagesY + 30);
    
        pdf.save(`HydroClean_Report_${startDate}_${endDate}.pdf`);
    };

    const lineChartData = {
        labels: sortedData.map(item => new Date(item.dateTime).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        ),
        datasets: [
            {
                label: 'Turbidity',
                data: sortedData.map(item => item.turbidity),
                borderColor: '#b30086',
                fill: false,
            },
            {
                label: 'TDS',
                data: sortedData.map(item => item.tdsValue),
                borderColor: '#FFD700',
                fill: false,
            },
            {
                label: 'pH',
                data: sortedData.map(item => item.ph_level),
                borderColor: '#7398d0',
                fill: false,
            },
            {
                label: 'Temperature',
                data: sortedData.map(item => item.temperature_level),
                borderColor: '#ffa500',
                fill: false,
            },
        ],
    };

    return (
        <>

            <header className="top-banner">
                <img src={headerImage} alt="Header" className="header-image" />
                <p>A Capstone Project at Colegio de San Juan de Letran Calamba in collaboration with the Calamba Water District | Telephone Nos: (049) 545-1614 | 545-2863 | 545-2728 | 545-7895</p>
            </header>

            <title>History</title>

            <div className={localStorage.getItem('isDarkMode') === 'true' ? 'container dark-mode' : 'container'}>
                {/* Sidebar Section */}
                <Sidebar items={[
                    { icon: 'dashboard', label: 'Dashboard', href: 'admindashboard' },
                    { icon: 'receipt_long', label: 'History', href: 'adminhistory', active: true },
                    { icon: 'settings', label: 'Settings', href: 'adminsettings' },
                    { icon: 'logout', label: 'Logout', href: 'login' }
                ]} />
                {/* End of Sidebar Section */}
                
                {/* Main Content */}
                <main>
                    <h1>History</h1>
                    
                    <div className="date-filter">
                        <label htmlFor="start-date">Start Date:</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <label htmlFor="end-date">End Date:</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    
                    <div className={`line-chart-container ${isDarkMode ? 'dark-mode' : ''}`}>
                    <Line 
                    data={lineChartData} 
                    options={{
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    color: isDarkMode ? '#fff' : '#808080', // Axis title color
                                },
                                grid: {
                                    color: isDarkMode ? '#555' : '#e0e0e0', // Grid lines color
                                },
                                ticks: {
                                    color: isDarkMode ? '#fff' : '#808080', // Tick labels color
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Value',
                                    color: isDarkMode ? '#fff' : '#808080', // Axis title color
                                },
                                grid: {
                                    color: isDarkMode ? '#555' : '#e0e0e0', // Grid lines color
                                },
                                ticks: {
                                    color: isDarkMode ? '#fff' : '#808080', // Tick labels color
                                    autoSkip: false,
                                    maxRotation: 0,
                                    minRotation: 0,
                                },          
                            },
                        },
                    responsive: true,
                    maintainAspectRatio: false, // This allows the chart to fill the container's height and width
                     }}
                    height={null}  // Let the container handle the height
                    width={null}   // Let the container handle the width
                    />
                    </div>

                    <div className="summary">
                        <p>Average Turbidity: {turbidityAvg.toFixed(2)}</p>
                        <p>Average pH: {phAvg.toFixed(2)}</p>
                        <p>Average TDS: {tdsAvg.toFixed(2)}</p>
                        <p>Average Temperature: {temperatureAvg.toFixed(2)}°C</p>
                    </div>

                      {/* Print to PDF button */}
                 <button onClick={printToPDF} className="print-button custom-button"
                  style={{position: 'relative',marginLeft: '840px',marginBottom: '-40px',display:'flex',alignItems:'center',margin:'20px 0'}}>
                 Print to PDF
                 </button>
                    {/* PDF Content Section */}
                    <div id="pdf-content" style={{ display: 'none' }}>
    <h1>HydroClean Report</h1>
    <h2>Data from {startDate} to {endDate}</h2>
    <table>
        <thead>
            <tr>
                <th>Date & Time</th>
                <th>Turbidity</th>
                <th>pH</th>
                <th>TDS</th>
                <th>Temperature</th>
            </tr>
        </thead>
        <tbody>
            {sortedData.map(item => (
                <tr key={item.dateTime}>
                    <td>{item.dateTime}</td>
                    <td>{item.turbidity}</td>
                    <td>{item.ph_level}</td>
                    <td>{item.tdsValue}</td>
                    <td>{item.temperature_level}</td>
                </tr>
            ))}
        </tbody>
    </table>
    <div className="averages">
        <p><strong>Average Turbidity:</strong> {turbidityAvg.toFixed(2)}</p>
        <p><strong>Average pH:</strong> {phAvg.toFixed(2)}</p>
        <p><strong>Average TDS:</strong> {tdsAvg.toFixed(2)}</p>
        <p><strong>Average Temperature:</strong> {temperatureAvg.toFixed(2)}°C</p>
    </div>
</div>

                    <h1 style={{ margin: '10px 0', textAlign: 'left' }}>Data Log</h1>
                    <DataTable
                        url={getAPI(server, "HydroClean/hydroclen_data.php") + `?start_date=${startDate}&end_date=${formattedEndDate}`}
                        className="recent-data"
                        title=""
                        customNames={['Date & Time', 'Turbidity', 'pH', 'TDS', 'Temperature']}
                    />
                </main>
                
                <div className={localStorage.getItem('isDarkMode') === 'true' ? 'container dark-mode' : 'container'}>


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
                            <div className="notification-popup">
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
                                    <li>
                                    <div className="icon">
                                                <span className="material-icons-sharp">dangerous</span>
                                            </div>
                                            <div className="content">
                                                <h4>Danger Level</h4>
                                                <small>No Data</small>
                                            </div>
                                    </li>
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
                                    <small className="text_muted">{goodLevelTime ? goodLevelTime : "No Data"}</small>
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
                                    <small className="text_muted">{dangerLevelTimes.length ? dangerLevelTimes[0] : "No Data"}</small>
                                </div>
                                <span className="material-icons-sharp">more_vert</span>
                                
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}
