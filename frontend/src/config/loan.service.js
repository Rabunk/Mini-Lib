import axiosClient from "./axiosClient";

export const loanService = {
    getAll() {
        return axiosClient.get('/loans');
    },
    borrow(data) {
        return axiosClient.post('/loans/borrow', data);
    },
    returnBook(id) {
        return axiosClient.post(`/loans/return/${id}`, data);
    }
};