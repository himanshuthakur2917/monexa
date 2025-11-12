"use client";

import { AuthContextType } from "@/interfaces/clientAuth";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    const login = () => setIsAuthenticated(true);
    const router = useRouter();

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setIsAuthenticated(false);
    };

    const refreshToken = async () => {
        try {
            const res = await axios.post("/api/auth/refresh");
            if (res.status !== 200 ) throw new Error("Refresh failed");
            const data = await res.data
            if (data.accessToken) setIsAuthenticated(true)
            else throw new Error("No access token");
            return data.accessToken;
        } catch (error) {
            console.error("Refresh token error:", error);
            setIsAuthenticated(false);
            await logout()
            router.push('/login')

            return null;
        }
    };

    

    useEffect(() => {
       checkAuth()
    },[isAuthenticated]);

    const checkAuth = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            if (res.status === 200) {
                const data = await res.data;
                setIsAuthenticated(true);
                // Schedule proactive refresh based on token expiry
                scheduleTokenRefresh(data.exp); // expiresIn in seconds
            } else {
                setIsAuthenticated(false);
            }
        } catch(error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const scheduleTokenRefresh = (expiresIn : number) => { 
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        // Refresh 1 minute before expiry (or halfway through if less than 2 min)
        const refreshTime = Math.max((expiresIn - 60) * 1000, (expiresIn * 1000) / 2);
        
        refreshTimerRef.current = setTimeout(async () => {
            const res = await refreshToken();
            if(res.ok) clearTimeout(refreshTimerRef.current)
        }, refreshTime);

        console.log("Schedule Executed Successfully")
         }

     const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        // Cookies are automatically sent with credentials: 'include'
        const res = await fetch(url, {
            ...options,
            credentials: 'include',
        });

        // If 401, try to refresh token via API route (fallback)
        if (res.status === 401) {
            const refreshSuccess = await refreshToken();
            
            if (refreshSuccess) {
                // Retry original request
                return fetch(url, {
                    ...options,
                    credentials: 'include',
                });
            } else {
                throw new Error("Session expired");
            }
        }

        return res;
    };

    useEffect(() => {
        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{isAuthenticated,isLoading, login, logout, fetchWithAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)!;
