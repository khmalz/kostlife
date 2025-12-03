"use client";

import {
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    FileText,
    Pencil,
} from "lucide-react";
import Link from "next/link";

export interface Transaction {
    id: string;
    type: "income" | "expense";
    amount: number;
    description: string;
    date: Date;
}

interface TransactionCardProps {
    transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const formattedAmount = new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
    }).format(transaction.amount);

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(transaction.date);

    const isIncome = transaction.type === "income";

    return (
        <div className="rounded-2xl bg-primary overflow-hidden">
            {/* Header with amount and edit button */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/20">
                <div className="flex items-center gap-2">
                    <CreditCard className="size-5 text-primary-foreground" />
                    <span className="text-lg font-bold text-primary-foreground">
                        IDR {formattedAmount}
                    </span>
                </div>
                <Link
                    href={`/budget/edit/${transaction.id}`}
                    className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
                    title="Edit transaction"
                >
                    <Pencil className="size-4 text-primary-foreground" />
                </Link>
            </div>

            {/* Transaction details */}
            <div className="flex flex-col gap-1.5 text-sm text-primary-foreground px-4 py-3">
                <div className="flex items-center gap-2">
                    {isIncome ? (
                        <ArrowUpCircle className="size-4 text-green-400" />
                    ) : (
                        <ArrowDownCircle className="size-4 text-red-400" />
                    )}
                    <span>{isIncome ? "Pemasukan" : "Pengeluaran"}</span>
                </div>

                <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Calendar className="size-4" />
                    <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2 text-primary-foreground/80">
                    <FileText className="size-4" />
                    <span className="line-clamp-1">
                        {transaction.description}
                    </span>
                </div>
            </div>
        </div>
    );
}
