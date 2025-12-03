"use client";

import type { Transaction } from "@/components/transaction-card";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TransactionFormProps {
    mode: "add" | "edit";
    initialData?: Transaction;
    onSubmit: (data: Omit<Transaction, "id">) => void;
    isLoading?: boolean;
}

export function TransactionForm({
    mode,
    initialData,
    onSubmit,
    isLoading = false,
}: TransactionFormProps) {
    const router = useRouter();

    const [category, setCategory] = useState<"income" | "expense">(
        initialData?.type ?? "expense",
    );
    const [amount, setAmount] = useState<string>(
        initialData?.amount?.toString() ?? "",
    );
    const [date, setDate] = useState<Date | undefined>(
        initialData?.date ?? undefined,
    );
    const [description, setDescription] = useState<string>(
        initialData?.description ?? "",
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!category || !amount || !date || !description.trim()) {
            return;
        }

        onSubmit({
            type: category,
            amount: parseFloat(amount),
            date: date,
            description: description.trim(),
        });
    };

    const handleBack = () => {
        router.back();
    };

    const isFormValid =
        category &&
        amount &&
        parseFloat(amount) > 0 &&
        date &&
        description.trim();

    return (
        <div className="w-full">
            {/* Mobile Header */}
            <header className="flex items-center justify-center relative px-4 py-4 md:hidden">
                <button
                    onClick={handleBack}
                    className="absolute left-4 flex items-center justify-center size-10 text-primary-foreground hover:bg-secondary/40 rounded-lg transition-colors"
                >
                    <ArrowLeft className="size-6" />
                </button>
                <h1 className="text-xl font-semibold text-primary-foreground">
                    {mode === "add" ? "Tambah Transaksi" : "Update Transaksi"}
                </h1>
            </header>

            <div className="hidden md:flex items-center gap-4 mb-8">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                >
                    <ArrowLeft className="size-5" />
                    <span className="font-medium">Kembali</span>
                </button>
            </div>

            <div className="mx-auto max-w-md">
                <div className="rounded-2xl border-2 border-primary/30 bg-secondary/50">
                    <h1 className="hidden md:block text-center text-xl md:text-2xl font-bold text-primary-foreground py-3">
                        {mode === "add"
                            ? "Tambah Transaksi"
                            : "Update Transaksi"}
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 p-6"
                    >
                        <Select
                            value={category}
                            onValueChange={(value: "income" | "expense") =>
                                setCategory(value)
                            }
                        >
                            <SelectTrigger className="w-full h-11 rounded-full bg-background border-0 text-foreground px-4">
                                <SelectValue placeholder="Kategori Transaksi" />
                            </SelectTrigger>
                            <SelectContent className="bg-background!">
                                <SelectItem
                                    value="income"
                                    className="hover:bg-secondary/80! hover:text-accent!"
                                >
                                    Income (Pemasukan)
                                </SelectItem>
                                <SelectItem
                                    value="expense"
                                    className="hover:bg-secondary/80! hover:text-accent!"
                                >
                                    Expense (Pengeluaran)
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <CurrencyInput
                            placeholder="Nominal Transaksi"
                            value={amount}
                            onChange={setAmount}
                            className="h-11 rounded-full bg-background border-0 text-foreground px-4 py-0 shadow-none placeholder:text-foreground/60"
                        />

                        <DatePicker
                            date={date}
                            onDateChange={setDate}
                            placeholder="Tanggal Transaksi"
                            className="h-11 rounded-full bg-background border-0 text-foreground px-4"
                        />

                        <Input
                            type="text"
                            placeholder="Deskripsi Transaksi"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-11 rounded-full bg-background border-0 text-foreground px-4 py-0 shadow-none placeholder:text-foreground/60"
                        />

                        <Button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="h-11 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? "Memproses..."
                                : mode === "add"
                                  ? "Tambah Transaksi"
                                  : "Update Transaksi"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
