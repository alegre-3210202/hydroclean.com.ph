import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import '../App.css';
// Register necessary components for chart.js
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineGraphProps {
    title: string;
    labels: string[];
    url: string;  // Added url prop
}

export default function LineGraph({ title, labels, url }: LineGraphProps) {  // Add url prop here
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true'; // Check dark mode state

        const fetchChartData = async () => {
            try {
                const response = await fetch(url);  // Use the passed URL
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Ensure data is sorted by DateTime in ascending order
                const sortedData = data.sort((a: any, b: any) => new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime());

                const latestData = sortedData.slice(-12);

                if (Array.isArray(data) && data.length > 0) {
                    const labelsData = latestData.map((item: any) =>
                        new Date(item.DateTime).toLocaleString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                    ); // Format X-axis labels

                    const pHValues = latestData.map((item: any) => item.ph_level); // Change to ph_level
                    const temperatureValues = latestData.map((item: any) => item.temperature_level); // Change to temperature_level

                    setChartData({
                        labels: labelsData,
                        datasets: [
                            {
                                label: 'pH',
                                data: pHValues,
                                borderColor: '#7398d0',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                            },
                            {
                                label: 'Temperature',
                                data: temperatureValues,
                                borderColor: '#ffa500',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                            },
                        ],
                    });
                } else {
                    console.error("No valid data received");
                    setChartData(null);
                }
            } catch (error) {
                console.error("Failed to fetch chart data:", error);
                setChartData(null);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchChartData(); // Initial fetch
    
            const intervalId = setInterval(fetchChartData, 1000); // Fetch every 10 seconds
    
            return () => clearInterval(intervalId); // Cleanup on unmount
        }, [url]);
    
        if (loading) {
            return <div>Loading...</div>;
        }

    return (
 
        <div className={`line-graph-container ${isDarkMode ? 'dark-mode' : ''}`}
            style={{
                width: '490px',
                marginTop: '-295px',
                marginLeft: '505px',
                padding: '20px',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                borderRadius: '20px',
              
            }}
        >
            <h2>{title}</h2>
            {chartData ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                             x: {
                                title: {
                                    display: true,
                                    text: labels[0],
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
                        elements: {
                            line: {
                                tension: 0.4
                            },
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                align: 'end',
                                labels: {
                                color: isDarkMode ? '#fff' : '#808080', // Legend text color
                                },
                            },
                        },
                    }}
                />
            ) : (
                <div>No data available</div>
            )}
            </div>
    );
}