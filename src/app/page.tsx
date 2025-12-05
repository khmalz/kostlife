import Footer from "@/components/footer";
import { Heart, TrendingUp, Utensils, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
    {
        icon: Utensils,
        title: "Resep Hemat",
        description:
            "Kumpulan resep makanan lezat dengan budget terjangkau untuk anak kost.",
    },
    {
        icon: Wallet,
        title: "Kelola Budget",
        description:
            "Catat pemasukan dan pengeluaran harian untuk mengatur keuanganmu dengan mudah.",
    },
    {
        icon: Heart,
        title: "Simpan Favorit",
        description: "Simpan resep favoritmu agar mudah ditemukan kapan saja.",
    },
    {
        icon: TrendingUp,
        title: "Pantau Keuangan",
        description:
            "Lihat ringkasan keuanganmu dan pastikan budget tetap terkendali.",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-primary flex flex-col">
            <section
                id="hero"
                className="flex flex-col items-center justify-center px-4 py-12 md:py-16"
            >
                <div className="flex flex-col items-center justify-center gap-4 max-w-4xl mx-auto text-center">
                    <Image
                        src="/assets/logo-light.png"
                        alt="KostLife Logo"
                        width={300}
                        height={300}
                        priority
                        className="mx-auto w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64"
                        style={{ height: "auto" }}
                    />
                    <p className="text-lg md:text-xl text-primary-foreground/80 text-center max-w-md">
                        Teman Setia Anak Kost!
                    </p>
                    <p className="text-sm md:text-base text-primary-foreground/60 text-center max-w-lg px-4">
                        Aplikasi lengkap untuk membantu kehidupan anak kost.
                        Temukan resep hemat, kelola keuangan, dan jalani hidup
                        kost yang lebih teratur.
                    </p>
                </div>
            </section>

            <section id="features" className="bg-primary py-12 md:py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground text-center mb-8 md:mb-12">
                        Fitur Unggulan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-primary-foreground/10 rounded-2xl p-6 text-center hover:bg-primary-foreground/20 transition-colors"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary mb-4">
                                    <feature.icon className="w-7 h-7 text-secondary-foreground" />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-primary-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-primary-foreground/70 text-sm md:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="cta" className="bg-secondary py-12 md:py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                        Siap Hidup Lebih Hemat?
                    </h2>
                    <p className="text-primary-foreground/70 text-sm md:text-base lg:text-lg max-w-xl mx-auto mb-8">
                        Jelajahi KostLife sekarang dan rasakan kemudahan
                        mengatur hidup anak kost. Gratis dan mudah digunakan!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/recipe"
                            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-lg transition hover:bg-primary/80 hover:scale-105"
                        >
                            Jelajahi Resep
                        </Link>
                        <Link
                            href="/auth/register"
                            className="px-8 py-3 rounded-full bg-primary-foreground text-primary font-semibold text-lg shadow-lg transition hover:bg-primary-foreground/90 hover:scale-105"
                        >
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
