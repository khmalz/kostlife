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
import Link from "next/link";
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
    const { user, isAuthenticated, logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated || !user) {
                setFavoriteIds([]);
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

    const filteredRecipes = useMemo(() => {
        return initialRecipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );
    }, [initialRecipes, debouncedSearch]);

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
                    {isAuthenticated ? (
                        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
                            <Heart className="size-4" />
                        </button>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/50 text-primary-foreground hover:bg-primary/70 transition-colors"
                            title="Login untuk akses favorit"
                        >
                            <Heart className="size-4" />
                        </Link>
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
                    <h2 className="mb-4 text-xl font-bold text-primary-foreground md:text-2xl md:mb-6">
                        Discover
                        <br />
                        New Recipe
                    </h2>

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
                            Resep tidak ditemukan.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}
