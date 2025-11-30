import { CreditCard } from "lucide-react";

interface WalletCardProps {
    balance: number;
}

export function WalletCard({ balance }: WalletCardProps) {
    const formattedBalance = new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
    }).format(balance);

    return (
        <div className="rounded-2xl bg-secondary p-5">
            <div className="mb-3 flex items-center gap-2">
                <CreditCard className="size-5 text-accent" />
                <span className="text-sm font-medium text-accent">
                    My Wallet
                </span>
            </div>
            <div>
                <p className="text-xs text-secondary-foreground/80">Balance</p>
                <p className="text-2xl font-bold text-secondary-foreground">
                    IDR {formattedBalance}
                </p>
            </div>
        </div>
    );
}
