"use client";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { Navbar } from "@/components/navbar";
import { RecipeCard } from "@/components/recipe-card";
import { SearchBar } from "@/components/search-bar";
import { WalletCard } from "@/components/wallet-card";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { getFavoriteRecipeIds } from "@/lib/services/favorite.service";
import type { RecipeWithImageURL } from "@/lib/services/server/recipe.service";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface RecipePageProps {
    initialRecipes: RecipeWithImageURL[];
    error?: string | null;
}

export default function RecipePage({
    initialRecipes,
    error: initialError,
}: RecipePageProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated || !user) {
                setFavoriteIds([]);
                setShowFavoritesOnly(false);
                return;
            }

            try {
                const ids = await getFavoriteRecipeIds(user.id);
                setFavoriteIds(ids);
            } catch (err) {
                console.error("Error fetching favorites:", err);
            }
        };

        fetchFavorites();
    }, [isAuthenticated, user]);

    // Handle favorite change from FavoriteButton
    const handleFavoriteChange = (recipeId: string, isFavorited: boolean) => {
        setFavoriteIds((prev) => {
            if (isFavorited) {
                return prev.includes(recipeId) ? prev : [...prev, recipeId];
            } else {
                return prev.filter((id) => id !== recipeId);
            }
        });
    };

    const handleLogin = () => {
        router.push("/auth/login");
    };

    const handleLogout = () => {
        logout();
    };

    const toggleFavoriteFilter = () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        setShowFavoritesOnly((prev) => !prev);
    };

    const filteredRecipes = useMemo(() => {
        let recipes = initialRecipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );

        // Filter by favorites if toggle is active
        if (showFavoritesOnly) {
            recipes = recipes.filter((recipe) =>
                favoriteIds.includes(recipe.id),
            );
        }

        return recipes;
    }, [initialRecipes, debouncedSearch, showFavoritesOnly, favoriteIds]);

    return (
        <div className="min-h-screen bg-secondary">
            {/* Desktop Navbar */}
            <Navbar
                isLoggedIn={isAuthenticated}
                isLoading={isLoading}
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
                        <button
                            onClick={toggleFavoriteFilter}
                            className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                                showFavoritesOnly
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/50 text-primary-foreground hover:bg-primary/70"
                            }`}
                            title={
                                showFavoritesOnly
                                    ? "Tampilkan semua resep"
                                    : "Tampilkan favorit saja"
                            }
                        >
                            <Heart
                                className={`size-4 ${showFavoritesOnly ? "fill-current" : ""}`}
                            />
                        </button>
                    )}
                </div>

                {isAuthenticated && (
                    <section className="mb-8 md:flex md:justify-center">
                        <div className="md:w-full md:max-w-lg">
                            <WalletCard balance={user?.amount_budget || 0} />
                        </div>
                    </section>
                )}

                <section>
                    <div className="mb-4 flex items-start justify-between md:mb-6 md:block">
                        <h2 className="text-xl font-bold text-primary-foreground md:text-2xl">
                            {showFavoritesOnly ? "My Favorites" : "Discover"}
                            <br />
                            {showFavoritesOnly ? "Recipes" : "New Recipe"}
                        </h2>

                        {isAuthenticated && (
                            <button
                                onClick={toggleFavoriteFilter}
                                className={`md:hidden flex size-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                                    showFavoritesOnly
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-primary/50 text-primary-foreground"
                                }`}
                                title={
                                    showFavoritesOnly
                                        ? "Tampilkan semua resep"
                                        : "Tampilkan favorit saja"
                                }
                            >
                                <Heart
                                    className={`size-5 ${showFavoritesOnly ? "fill-current" : ""}`}
                                />
                            </button>
                        )}
                    </div>

                    {initialError && (
                        <p className="text-center text-red-400">
                            {initialError}
                        </p>
                    )}

                    {!initialError && (
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                            {filteredRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    isFavorite={favoriteIds.includes(recipe.id)}
                                    onFavoriteChange={(isFavorited) =>
                                        handleFavoriteChange(
                                            recipe.id,
                                            isFavorited,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {!initialError && filteredRecipes.length === 0 && (
                        <p className="text-center text-primary-foreground/60">
                            {showFavoritesOnly
                                ? "Belum ada resep favorit."
                                : "Resep tidak ditemukan."}
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}
