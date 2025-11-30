import {
    getAuthCookie,
    removeAuthCookie,
    setAuthCookie,
    type UserSession,
} from '@/lib/cookies';
import {
    hashPasswordWithSalt,
    verifyPasswordWithSalt,
} from '@/lib/crypto';
import {
    addDocument,
    getDocument,
    queryDocuments,
    updateDocument,
} from '@/lib/firebase/firestore';

export interface User {
  id: string;
  username: string;
  password: string; // Hashed password
  salt: string; // Salt for password hashing
  amount_budget: number;
  createdAt: string;
  updatedAt?: string;
}

export type SafeUser = Omit<User, 'password' | 'salt'>;

export const registerUser = async (
  username: string,
  password: string,
  initialBudget: number = 0
): Promise<{ success: boolean; user?: SafeUser; error?: string }> => {
  try {
    // Check if username already exists
    const existingUsers = await queryDocuments<User>(
      'users',
      [{ field: 'username', operator: '==', value: username }]
    );

    if (existingUsers.length > 0) {
      return { success: false, error: 'Username already exists' };
    }

    // Hash password with salt
    const { hash, salt } = await hashPasswordWithSalt(password);

    const userId = await addDocument('users', {
      username,
      password: hash,
      salt,
      amount_budget: initialBudget,
      createdAt: new Date().toISOString(),
    });

    const user: SafeUser = {
      id: userId,
      username,
      amount_budget: initialBudget,
      createdAt: new Date().toISOString(),
    };

    // Set auth cookie (7 days expiry)
    const session: UserSession = {
      id: userId,
      username,
      amount_budget: initialBudget,
    };
    setAuthCookie(session);

    return { success: true, user };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Registration failed' };
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; user?: SafeUser; error?: string }> => {
  try {
    // find user by username only
    const users = await queryDocuments<User>(
      'users',
      [{ field: 'username', operator: '==', value: username }]
    );

    if (users.length === 0) {
      return { success: false, error: 'Username or password is incorrect' };
    }

    const user = users[0];

    // Verify password with stored hash and salt
    const isValidPassword = await verifyPasswordWithSalt(
      password,
      user.password,
      user.salt
    );

    if (!isValidPassword) {
      return { success: false, error: 'Username or password is incorrect' };
    }

    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      amount_budget: user.amount_budget,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Set auth cookie (7 days expiry)
    const session: UserSession = {
      id: user.id,
      username: user.username,
      amount_budget: user.amount_budget,
    };
    setAuthCookie(session);

    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const getCurrentUser = (): UserSession | null => {
  return getAuthCookie();
};

export const logoutUser = (): void => {
  removeAuthCookie();
};

export const isLoggedIn = (): boolean => {
  return getAuthCookie() !== null;
};

export const getUserById = async (userId: string): Promise<SafeUser | null> => {
  try {
    const user = await getDocument<User>('users', userId);
    if (!user) return null;

    // Return without password and salt
    return {
      id: user.id,
      username: user.username,
      amount_budget: user.amount_budget,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const updateUserBudget = async (
  userId: string,
  newAmount: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    await updateDocument('users', userId, {
      amount_budget: newAmount,
      updatedAt: new Date().toISOString(),
    });

    // Update cookie if the updated user is the current user
    const currentSession = getAuthCookie();
    if (currentSession && currentSession.id === userId) {
      const updatedSession: UserSession = {
        ...currentSession,
        amount_budget: newAmount,
      };
      setAuthCookie(updatedSession);
    }

    return { success: true };
  } catch (error) {
    console.error('Update budget error:', error);
    return { success: false, error: 'Update budget failed' };
  }
};

export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get user to verify current password
    const user = await getDocument<User>('users', userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Verify current password
    const isValidPassword = await verifyPasswordWithSalt(
      currentPassword,
      user.password,
      user.salt
    );

    if (!isValidPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Hash new password with new salt
    const { hash, salt } = await hashPasswordWithSalt(newPassword);

    await updateDocument('users', userId, {
      password: hash,
      salt,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'Update password failed' };
  }
};

/**
 * Refresh user session from Firestore
 */
export const refreshUserSession = async (): Promise<{ success: boolean; user?: UserSession; error?: string }> => {
  try {
    const currentSession = getAuthCookie();
    if (!currentSession) {
      return { success: false, error: 'No active session' };
    }

    const freshUser = await getUserById(currentSession.id);
    if (!freshUser) {
      removeAuthCookie();
      return { success: false, error: 'User not found' };
    }

    const updatedSession: UserSession = {
      id: freshUser.id,
      username: freshUser.username,
      amount_budget: freshUser.amount_budget,
    };
    setAuthCookie(updatedSession);

    return { success: true, user: updatedSession };
  } catch (error) {
    console.error('Refresh session error:', error);
    return { success: false, error: 'Failed to refresh session' };
  }
};
