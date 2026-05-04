import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export  async function registerUser(username, email, password) {
    try {
        const response = await api.post(
            "/api/auth/register",
            {
                username,
                email,
                password,
            },

        );

        return response.data;
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }
}

export  async function loginUser(email, password) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        }

        )
        return response.data
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }

}

export  async function logoutUser() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }
}

export async function getUserData() {
    try {
        const response = await api.get("/api/auth/profile");
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}
