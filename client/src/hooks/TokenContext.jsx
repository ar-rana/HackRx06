import { createContext, useContext, useEffect, useState } from "react";

const AuthTokenContext = createContext(null);

export const AuthContext = ({ children }) => {
    const [token, setToken] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);
    }, [token]);

    return (
        <AuthTokenContext.Provider value={{token, setToken}}>
            {children}
        </AuthTokenContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthTokenContext);
}