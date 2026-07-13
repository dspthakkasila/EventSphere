import axios from "axios";

// Auth doesn't need the token interceptor — these are public endpoints
const authApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/accounts/",
});

export const registerUser = (data) => authApi.post("register/", data);

export const loginUser = (data) => authApi.post("login/", data);
