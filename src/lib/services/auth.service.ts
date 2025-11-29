'use client';

import {
    addDocument,
    queryDocuments,
    updateDocument
} from '@/lib/firebase/firestore';

// ==================== TYPES ====================

export interface User {
  id: string;
  username: string;
  password: string; // Hash di production dengan bcrypt!
  amount_budget: number; // Budget yang tersedia
  createdAt: string;
  updatedAt?: string;
}

// ==================== AUTH FUNCTIONS ====================

/**
 * Register user baru
 * PENTING: Di production, hash password dengan bcrypt!
 */
export const registerUser = async (
  username: string,
  password: string,
  initialBudget: number = 0
): Promise<{ success: boolean; userId?: string; error?: string }> => {
  try {
    // Check if username already exists
    const existingUsers = await queryDocuments<User>(
      'users',
      [{ field: 'username', operator: '==', value: username }]
    );

    if (existingUsers.length > 0) {
      return { success: false, error: 'Username sudah digunakan' };
    }

    // Create new user
    // PENTING: Hash password di production!
    const userId = await addDocument('users', {
      username,
      password, // TODO: Hash dengan bcrypt!
      amount_budget: initialBudget,
      createdAt: new Date().toISOString(),
    });

    return { success: true, userId };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Gagal registrasi' };
  }
};

/**
 * Login user
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const users = await queryDocuments<User>(
      'users',
      [
        { field: 'username', operator: '==', value: username },
        { field: 'password', operator: '==', value: password }, // TODO: Compare hash!
      ]
    );

    if (users.length === 0) {
      return { success: false, error: 'Username atau password salah' };
    }

    const user = users[0];

    // Simpan ke localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Gagal login' };
  }
};

/**
 * Get current logged in user
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Logout user
 */
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
};

/**
 * Update user budget amount
 */
export const updateUserBudget = async (
  userId: string,
  newAmount: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    await updateDocument('users', userId, {
      amount_budget: newAmount,
      updatedAt: new Date().toISOString(),
    });

    // Update localStorage jika user yang sedang login
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.amount_budget = newAmount;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return { success: true };
  } catch (error) {
    console.error('Update budget error:', error);
    return { success: false, error: 'Gagal update budget' };
  }
};
