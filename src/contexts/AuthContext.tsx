"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import {
    getCurrentUser,
    loginUser,
    logoutUser as logoutService,
    registerUser,
    refreshUserSession,
    type SafeUser,
} from "@/lib/services/auth.service";
import { setAuthCookie, type UserSession } from "@/lib/cookies";

interface AuthContextType {
    user: UserSession | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (
        username: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    register: (
        username: string,
        password: string,
        initialBudget?: number,
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshSession: () => Promise<void>;
    updateBudget: (newAmount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                const currentUser = getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Error initializing auth:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(
        async (
            username: string,
            password: string,
        ): Promise<{ success: boolean; error?: string }> => {
            try {
                setIsLoading(true);
                const result = await loginUser(username, password);

                if (result.success && result.user) {
                    const session: UserSession = {
                        id: result.user.id,
                        username: result.user.username,
                        amount_budget: result.user.amount_budget,
                    };
                    setUser(session);
                    return { success: true };
                }

                return {
                    success: false,
                    error: result.error || "Login failed",
                };
            } catch (error) {
                console.error("Login error:", error);
                return {
                    success: false,
                    error: "An error occurred during login",
                };
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const register = useCallback(
        async (
            username: string,
            password: string,
            initialBudget: number = 0,
        ): Promise<{ success: boolean; error?: string }> => {
            try {
                setIsLoading(true);
                const result = await registerUser(
                    username,
                    password,
                    initialBudget,
                );

                if (result.success && result.user) {
                    const session: UserSession = {
                        id: result.user.id,
                        username: result.user.username,
                        amount_budget: result.user.amount_budget,
                    };
                    setUser(session);
                    return { success: true };
                }

                return {
                    success: false,
                    error: result.error || "Registration failed",
                };
            } catch (error) {
                console.error("Register error:", error);
                return {
                    success: false,
                    error: "An error occurred during registration",
                };
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const logout = useCallback(() => {
        logoutService();
        setUser(null);
    }, []);

    const refreshSession = useCallback(async () => {
        try {
            const result = await refreshUserSession();
            if (result.success && result.user) {
                setUser(result.user);
            } else {
                // Session invalid, clear user
                setUser(null);
            }
        } catch (error) {
            console.error("Refresh session error:", error);
        }
    }, []);

    /**
     * Update budget amount in state and cookie
     * Used by budget operations to sync UI after transactions
     */
    const updateBudget = useCallback((newAmount: number) => {
        setUser((prev) => {
            if (!prev) return null;

            const updatedUser: UserSession = {
                ...prev,
                amount_budget: newAmount,
            };

            // Also update cookie
            setAuthCookie(updatedUser);

            return updatedUser;
        });
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        refreshSession,
        updateBudget,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

// Export types
export type { AuthContextType, UserSession, SafeUser };
