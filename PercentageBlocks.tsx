import { useEffect, useState } from 'react';
import fetchData from './GetData';
import PercentageBlock from './PercentageBlock'; // Assuming PercentageBlock is in the same directory
import { getAPI } from './Server';
import { server } from '../config';

export default function PercentageBlocks() {
    const [sensorData, setSensorData] = useState<any>(null);

    useEffect(() => {
        const fetchSensorData = async () => {
            let url = getAPI(server, "HydroClean/hydroclen_data.php");
            const data = await fetchData(url);
            const latestData = data[data.length - 1];

            setSensorData({
                turbidityVal: latestData.turbidity, 
                phVal: latestData.ph_level,
                tdsVal: latestData.tdsValue,
                tempVal: latestData.temperature_level
            });
        };

        fetchSensorData(); // Initial fetch

        const intervalId = setInterval(fetchSensorData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    if (!sensorData) {
        return <div>Loading...</div>;
    }

    return (
        <PercentageBlock list={[
            { label: "Turbidity Level", color: "blue", value: sensorData.turbidityVal, maxPercentage: 3000 },
            { label: "pH Level", color: "blue", value: sensorData.phVal, maxPercentage: 14 },
            { label: "TDS level", color: "blue", value: sensorData.tdsVal, maxPercentage: 2000 },
            { label: "Temperature Level", color: "blue", value: sensorData.tempVal, maxPercentage: 125 }
        ]} />
    );
}