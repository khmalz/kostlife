/**
 * Usage:
 * import { useAuth } from '@/hooks/useAuth';
 *
 * const { user, isAuthenticated, login, logout, register } = useAuth();
 */

export { useAuth, type AuthContextType, type SafeUser, type UserSession } from '@/contexts/AuthContext';
