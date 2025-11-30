"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Flame, Clock } from "lucide-react";
import { Navbar } from "@/components/navbar";
import {
    getRecipe,
    type RecipeWithImageURL,
} from "@/lib/services/recipe.service";

export default function RecipeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<RecipeWithImageURL | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const recipeId = params.id as string;

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeId) {
                setError("Recipe ID tidak ditemukan.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const fetchedRecipe = await getRecipe(recipeId);

                if (!fetchedRecipe) {
                    setError("Resep tidak ditemukan.");
                } else {
                    setRecipe(fetchedRecipe);
                }
            } catch (err) {
                console.error("Error fetching recipe:", err);
                setError("Gagal memuat resep. Silakan coba lagi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    const formattedPrice = recipe
        ? new Intl.NumberFormat("id-ID", {
              style: "decimal",
              minimumFractionDigits: 0,
          }).format(recipe.price)
        : "0";

    const handleBack = () => {
        router.back();
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-foreground/30 border-t-primary-foreground"></div>
            </div>
        );
    }

    // Error State
    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-4 px-4">
                <p className="text-center text-red-400">
                    {error || "Resep tidak ditemukan."}
                </p>
                <button
                    onClick={handleBack}
                    className="text-primary-foreground underline"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            {/* Desktop Navbar */}
            <Navbar
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />

            {/* Mobile Header */}
            <header className="flex items-center justify-center relative px-4 py-4 md:hidden">
                <button
                    onClick={handleBack}
                    className="absolute left-4 flex items-center justify-center size-10 text-primary-foreground hover:bg-secondary/40 rounded-lg transition-colors"
                >
                    <ArrowLeft className="size-6" />
                </button>
                <h1 className="text-xl font-semibold text-primary-foreground">
                    Recipe
                </h1>
            </header>

            <main className="px-4 pb-8 md:px-8 md:py-10 md:max-w-6xl md:mx-auto">
                <button
                    onClick={handleBack}
                    className="hidden md:flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors mb-6"
                >
                    <ArrowLeft className="size-5" />
                    <span className="font-medium">Kembali</span>
                </button>

                <div className="md:flex md:gap-10">
                    <section className="mb-6 md:mb-0 md:w-2/5 md:shrink-0">
                        <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl md:sticky md:top-8">
                            <Image
                                src={recipe.imageURL || recipe.image}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 400px"
                                priority
                            />
                        </div>
                    </section>

                    <div className="md:flex-1">
                        <section className="mb-4 md:mb-6">
                            <h2 className="text-2xl font-bold text-primary-foreground mb-1 md:text-3xl">
                                {recipe.title}
                            </h2>
                            <p className="text-base text-primary-foreground/80 md:text-lg">
                                Rp. {formattedPrice},00
                            </p>
                        </section>

                        <div className="h-px bg-secondary w-full mb-4 md:mb-6" />

                        <section className="flex items-center gap-6 mb-6 md:mb-8 text-primary-foreground/80">
                            <span className="flex items-center gap-2 md:text-lg">
                                <Flame className="size-4 md:size-5" />±{" "}
                                {recipe.calories} Kkal
                            </span>
                            <span className="flex items-center gap-2 md:text-lg">
                                <Clock className="size-4 md:size-5" />
                                {recipe.cookTime} min
                            </span>
                        </section>

                        <section className="mb-6 md:mb-8">
                            <div className="inline-block bg-secondary px-4 py-2 rounded-lg mb-4">
                                <h3 className="text-sm font-semibold text-primary-foreground md:text-base">
                                    Ingredients & Tools
                                </h3>
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 text-primary-foreground/90 md:space-y-2">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li
                                        key={index}
                                        className="text-sm md:text-base"
                                    >
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <div className="inline-block bg-secondary px-4 py-2 rounded-lg mb-4">
                                <h3 className="text-sm font-semibold text-primary-foreground md:text-base">
                                    Instruction
                                </h3>
                            </div>
                            <ol className="list-decimal list-inside space-y-2 text-primary-foreground/90 md:space-y-3">
                                {recipe.instructions.map(
                                    (instruction, index) => (
                                        <li
                                            key={index}
                                            className="text-sm leading-relaxed md:text-base md:leading-relaxed"
                                        >
                                            {instruction}
                                        </li>
                                    ),
                                )}
                            </ol>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
