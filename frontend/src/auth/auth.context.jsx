import { createContext, useEffect, useState } from "react";
import { getUserData } from "./auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();
                setUser(data.user ?? data);
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error("Failed to fetch user:", error);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
            {children}
        </AuthContext.Provider>
    )

}


