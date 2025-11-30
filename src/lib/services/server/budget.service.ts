import {
    getDocument,
    queryDocuments,
} from '@/lib/firebase/firestore';

export interface Budget {
    id: string;
    userId: string;
    type: 'income' | 'expense';
    budget_at: string; // ISO date string
    amount: number;
    description: string;
    createdAt: string;
    updatedAt?: string;
}

export interface BudgetSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    currentBudget: number;
}

/**
 * Get single budget by ID
 */
export const getBudgetById = async (budgetId: string): Promise<Budget | null> => {
    try {
        const budget = await getDocument<Budget>('budgets', budgetId);
        return budget;
    } catch (error) {
        console.error('Get budget error:', error);
        return null;
    }
};

/**
 * Get all budgets for a user
 */
export const getUserBudgets = async (
    userId: string,
    orderByField: 'budget_at' | 'createdAt' = 'budget_at',
    direction: 'asc' | 'desc' = 'desc',
    limitCount?: number
): Promise<Budget[]> => {
    try {
        const budgets = await queryDocuments<Budget>(
            'budgets',
            [{ field: 'userId', operator: '==', value: userId }],
            orderByField,
            direction,
            limitCount
        );

        return budgets;
    } catch (error) {
        console.error('Get user budgets error:', error);
        return [];
    }
};

/**
 * Get budgets by type (income/expense)
 */
export const getBudgetsByType = async (
    userId: string,
    type: 'income' | 'expense',
    limitCount?: number
): Promise<Budget[]> => {
    try {
        const budgets = await queryDocuments<Budget>(
            'budgets',
            [
                { field: 'userId', operator: '==', value: userId },
                { field: 'type', operator: '==', value: type },
            ],
            'budget_at',
            'desc',
            limitCount
        );

        return budgets;
    } catch (error) {
        console.error('Get budgets by type error:', error);
        return [];
    }
};

/**
 * Get budgets within date range
 */
export const getBudgetsByDateRange = async (
    userId: string,
    startDate: string,
    endDate: string
): Promise<Budget[]> => {
    try {
        const budgets = await queryDocuments<Budget>(
            'budgets',
            [
                { field: 'userId', operator: '==', value: userId },
                { field: 'budget_at', operator: '>=', value: startDate },
                { field: 'budget_at', operator: '<=', value: endDate },
            ],
            'budget_at',
            'desc'
        );

        return budgets;
    } catch (error) {
        console.error('Get budgets by date range error:', error);
        return [];
    }
};

/**
 * Get budget summary (total income, expense, balance)
 */
export const getBudgetSummary = async (
    userId: string,
    currentUserBudget: number = 0
): Promise<BudgetSummary> => {
    try {
        const budgets = await getUserBudgets(userId);

        const totalIncome = budgets
            .filter((b) => b.type === 'income')
            .reduce((sum, b) => sum + b.amount, 0);

        const totalExpense = budgets
            .filter((b) => b.type === 'expense')
            .reduce((sum, b) => sum + b.amount, 0);

        const balance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            balance,
            currentBudget: currentUserBudget,
        };
    } catch (error) {
        console.error('Get budget summary error:', error);
        return {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            currentBudget: currentUserBudget,
        };
    }
};

/**
 * Get monthly summary
 */
export const getMonthlySummary = async (
    userId: string,
    year: number,
    month: number, // 1-12
    currentUserBudget: number = 0
): Promise<BudgetSummary> => {
    try {
        // Get start and end of month
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

        const budgets = await getBudgetsByDateRange(userId, startDate, endDate);

        const totalIncome = budgets
            .filter((b) => b.type === 'income')
            .reduce((sum, b) => sum + b.amount, 0);

        const totalExpense = budgets
            .filter((b) => b.type === 'expense')
            .reduce((sum, b) => sum + b.amount, 0);

        const balance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            balance,
            currentBudget: currentUserBudget,
        };
    } catch (error) {
        console.error('Get monthly summary error:', error);
        return {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            currentBudget: currentUserBudget,
        };
    }
};

/**
 * Get recent budgets (shorthand for getUserBudgets with limit)
 */
export const getRecentBudgets = async (
    userId: string,
    limit: number = 10
): Promise<Budget[]> => {
    return getUserBudgets(userId, 'budget_at', 'desc', limit);
};
