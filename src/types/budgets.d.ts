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
