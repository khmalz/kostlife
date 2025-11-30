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
        <div className="rounded-3xl bg-primary p-5">
            <div className="mb-3 flex items-center gap-2">
                <CreditCard className="size-8 text-primary-foreground" />
                <span className="text-base font-medium text-primary-foreground">
                    My Wallet
                </span>
            </div>
            <div>
                <p className="text-base text-primary-foreground/80">Balance</p>
                <p className="text-2xl font-bold text-primary-foreground">
                    IDR {formattedBalance}
                </p>
            </div>
        </div>
    );
}
