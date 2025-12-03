import { CreditCard, PlusCircle } from "lucide-react";

interface WalletCardProps {
    balance: number;
    onAddTransaction?: () => void;
}

export function WalletCard({ balance, onAddTransaction }: WalletCardProps) {
    const formattedBalance = new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
    }).format(balance);

    return (
        <div className="rounded-3xl bg-primary p-5 flex items-center justify-between gap-4">
            <div>
                <div className="mb-3 flex items-center gap-2">
                    <CreditCard className="size-8 text-primary-foreground" />
                    <span className="text-base font-medium text-primary-foreground">
                        My Wallet
                    </span>
                </div>
                <div>
                    <p className="text-base text-primary-foreground/80">
                        Saldo
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground">
                        Rp {formattedBalance}
                    </p>
                </div>
            </div>

            <button
                onClick={onAddTransaction}
                className="flex flex-col items-center gap-1 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                aria-label="Add transaction"
            >
                <PlusCircle className="size-6 md:size-8" />
                <span className="text-xs font-medium text-center leading-tight">
                    Tambah
                    <br />
                    Transaksi
                </span>
            </button>
        </div>
    );
}
