"use client";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { Navbar } from "@/components/navbar";
import { RecipeCard } from "@/components/recipe-card";
import { SearchBar } from "@/components/search-bar";
import { WalletCard } from "@/components/wallet-card";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import {
    getAllRecipes,
    type RecipeWithImageURL,
} from "@/lib/services/recipe.service";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function RecipePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [recipes, setRecipes] = useState<RecipeWithImageURL[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedRecipes = await getAllRecipes();

                // Use imageURL for the image field display
                const recipesWithResolvedImages = fetchedRecipes.map(
                    (recipe) => ({
                        ...recipe,
                        image: recipe.imageURL || recipe.image,
                    }),
                );

                setRecipes(recipesWithResolvedImages);
            } catch (err) {
                console.error("Error fetching recipes:", err);
                setError("Gagal memuat resep. Silakan coba lagi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleFavoriteToggle = (id: string) => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            router.push("/auth/login?returnUrl=/recipe");
            return;
        }

        setRecipes((prev) =>
            prev.map((recipe) =>
                recipe.id === id
                    ? { ...recipe, isFavorite: !recipe.isFavorite }
                    : recipe,
            ),
        );
    };

    const handleLogin = () => {
        router.push("/auth/login");
    };

    const handleLogout = () => {
        logout();
    };

    const filteredRecipes = useMemo(() => {
        return recipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );
    }, [recipes, debouncedSearch]);

    return (
        <div className="min-h-screen bg-secondary">
            {/* Desktop Navbar */}
            <Navbar
                isLoggedIn={isAuthenticated}
                username={user?.username}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />

            <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                {/* Mobile Header */}
                <header className="mb-6 flex items-center gap-3 md:hidden">
                    <MobileSidebar />
                    <SearchBar
                        placeholder="Cari resep..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </header>

                <div className="hidden md:flex md:items-center md:justify-center md:gap-4 md:mb-8 md:max-w-lg md:mx-auto">
                    <SearchBar
                        placeholder="Cari resep..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                    {isAuthenticated && (
                        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
                            <Heart className="size-4" />
                        </button>
                    )}
                </div>

                {/* Wallet Section - Only for authenticated users */}
                {isAuthenticated && user && (
                    <section className="mb-8 md:flex md:justify-center">
                        <div className="md:w-full md:max-w-lg">
                            <WalletCard balance={user.amount_budget || 0} />
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="mb-4 text-xl font-bold text-primary-foreground md:text-2xl md:mb-6">
                        Discover
                        <br />
                        New Recipe
                    </h2>

                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-foreground/30 border-t-primary-foreground"></div>
                        </div>
                    )}

                    {error && !isLoading && (
                        <p className="text-center text-red-400">{error}</p>
                    )}

                    {/* Recipes List - Mobile: Stack, Desktop: Grid */}
                    {!isLoading && !error && (
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                            {filteredRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onFavoriteToggle={handleFavoriteToggle}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && filteredRecipes.length === 0 && (
                        <p className="text-center text-primary-foreground/60">
                            Resep tidak ditemukan.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}
