"use client";

import { useState, useMemo, useEffect } from "react";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { SearchBar } from "@/components/search-bar";
import { WalletCard } from "@/components/wallet-card";
import { RecipeCard } from "@/components/recipe-card";
import {
    getAllRecipes,
    type RecipeWithImageURL,
} from "@/lib/services/recipe.service";
import { useDebounce } from "@/hooks/useDebounce";

export default function RecipePage() {
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
        setRecipes((prev) =>
            prev.map((recipe) =>
                recipe.id === id
                    ? { ...recipe, isFavorite: !recipe.isFavorite }
                    : recipe,
            ),
        );
    };

    const filteredRecipes = useMemo(() => {
        return recipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );
    }, [recipes, debouncedSearch]);

    return (
        <div className="min-h-screen bg-secondary">
            <div className="mx-auto max-w-md px-4 py-6">
                <header className="mb-6 flex items-center gap-3">
                    <MobileSidebar />
                    <SearchBar
                        placeholder="Cari resep..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </header>

                <section className="mb-8">
                    <WalletCard balance={40000} />
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-bold text-white/90">
                        Discover
                        <br />
                        New Recipe
                    </h2>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-foreground/30 border-t-primary-foreground"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <p className="text-center text-red-400">{error}</p>
                    )}

                    {/* Recipes List */}
                    {!isLoading && !error && (
                        <div className="flex flex-col gap-4">
                            {filteredRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onFavoriteToggle={handleFavoriteToggle}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
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
