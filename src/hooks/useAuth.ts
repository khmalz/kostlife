/**
 * useAuth hook
 *
 * Re-export useAuth from AuthContext for convenient importing.
 * This allows components to import from hooks folder instead of contexts.
 *
 * Usage:
 * import { useAuth } from '@/hooks/useAuth';
 *
 * const { user, isAuthenticated, login, logout, register, updateBudget } = useAuth();
 */

export {
    useAuth,
    type AuthContextType,
    type SafeUser,
    type UserSession,
} from "@/contexts/AuthContext";
