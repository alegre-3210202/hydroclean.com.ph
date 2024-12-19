import axios from 'axios';
async function postData(url: string, inputs: any): Promise<any> {
    try {
        const response = await axios.post(url, inputs)
        return response.data;
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        return [];
    }
};

export default postData;