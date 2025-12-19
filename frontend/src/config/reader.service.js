import axiosClient from "./axiosClient";

export const readerService = {
    getAll() {
        return axiosClient.get('/readers');
    },
    create(data) {
        return axiosClient.post('/readers', data);
    },
    update(id, data) {
        return axiosClient.put(`/readers/${id}`, data);
    },
    remove(id) {
        return axiosClient.delete(`/readers/${id}`);
    }
}