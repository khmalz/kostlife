"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    FileText,
    Pencil,
    Trash2,
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
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
}

export function TransactionCard({
    transaction,
    onDelete,
    isDeleting,
}: TransactionCardProps) {
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

    const handleDelete = () => {
        onDelete?.(transaction.id);
    };

    return (
        <div className="rounded-2xl bg-primary overflow-hidden">
            {/* Header with amount and action buttons */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/20">
                <div className="flex items-center gap-2">
                    <CreditCard className="size-5 text-primary-foreground" />
                    <span className="text-lg font-bold text-primary-foreground">
                        Rp {formattedAmount}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/budget/edit/${transaction.id}`}
                        className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
                        title="Ubah Transaksi"
                    >
                        <Pencil className="size-4 text-primary-foreground" />
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="p-1.5 rounded-full hover:bg-destructive/20 transition-colors"
                                title="Hapus Transaksi"
                                disabled={isDeleting}
                            >
                                <Trash2 className="size-4 text-red-400" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Konfirmasi Hapus
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Yakin ingin menghapus transaksi ini? Saldo
                                    Anda akan disesuaikan kembali.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
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
