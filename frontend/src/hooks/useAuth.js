import { useContext } from "react";
import { AuthContext } from "../auth/auth.context";
import { registerUser, loginUser, logoutUser, getUserData } from "../auth/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await registerUser(username, email, password);
            setUser(data.user);
            return true;
        } catch (err) {
            console.error("Register Error:", err.response?.data || err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            setUser(data.user);
            return true;
        } catch (err) {
            console.error("Login Error:", err.response?.data || err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
            return true;
        } catch (err) {
            console.error("Logout Error:", err.response?.data || err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { user, loading, handleLogin, handleLogout, handleRegister }

} 
