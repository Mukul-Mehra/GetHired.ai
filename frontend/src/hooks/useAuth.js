import { useContext } from "react";
import { AuthContext } from "../auth/auth.context";
import { registerUser, loginUser, logoutUser, getUserData } from "../auth/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, error, setError } = context

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await registerUser(username, email, password);
            setUser(data.user);
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || err.message || "Registration failed";
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser(email, password);
            setUser(data.user);
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || err.message || "Login failed";
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            await logoutUser();
            setUser(null);
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || err.message || "Logout failed";
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { user, loading, error, setError, handleLogin, handleLogout, handleRegister }

} 
