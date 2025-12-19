import axiosClient from "./axiosClient";

export const bookService = {
  getAll() {
    return axiosClient.get("/books");
  },

  create(data) {
    return axiosClient.post("/books", data);
  },

  update(id, data) {
    return axiosClient.put(`/books/${id}`, data);
  },

  remove(id) {
    return axiosClient.delete(`/books/${id}`);
  }
};
