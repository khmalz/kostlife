import Link from "next/link";

export default function RecipeNotFound() {
    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6 px-4">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-foreground mb-2">
                    404
                </h1>
                <p className="text-lg text-primary-foreground/80">
                    Resep tidak ditemukan.
                </p>
            </div>
            <Link
                href="/recipe"
                className="px-6 py-3 bg-secondary text-primary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
                Kembali ke Daftar Resep
            </Link>
        </div>
    );
}
