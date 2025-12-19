import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const requestInit = async () => {
    // You can add any initialization logic here if needed
    const response = await request.get('/test');
    return response.data;
}