import axiosClient from "./axiosClient";

export const dashboardService = {
    getSummary() {
        return axiosClient.get('/dashboard/summary');
    }
    
}