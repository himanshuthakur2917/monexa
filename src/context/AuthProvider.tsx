"use client";

import { AuthContextType } from "@/interfaces/clientAuth";
import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = (token: string) => setAccessToken(token);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setAccessToken(null);
    };

    const refreshToken = async () => {
        try {
            const res = await fetch("/api/auth/refresh", { method: "POST" });
            if (!res.ok) throw new Error("Refresh failed");
            const data = await res.json();
            setAccessToken(data.accessToken);
            return data.accessToken;
        } catch {
            setAccessToken(null);
            return null;
        }
    };

    interface JWTPayload {
        exp: number;
    }

    useEffect(() => {
        if (!accessToken) return;
        const decoded = jwtDecode<JWTPayload>(accessToken);
        const expiryTime = decoded.exp * 1000 - Date.now() - 60_000; // refresh 1 min early
        const timer = setTimeout(refreshToken, Math.max(expiryTime, 5000));
        return () => clearTimeout(timer);
    }, [accessToken]);

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        if (!accessToken) {
            const newToken = await refreshToken();
            if (!newToken) throw new Error("Session expired");
        }

        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // If 401 → refresh and retry once
        if (res.status === 401) {
            const newToken = await refreshToken();
            if (!newToken) throw new Error("Session expired");
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`,
                },
            });
        }

        return res;
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, login, logout, fetchWithAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)!;
