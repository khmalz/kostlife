"use client";

import { useState, useMemo } from "react";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { SearchBar } from "@/components/search-bar";
import { WalletCard } from "@/components/wallet-card";
import { RecipeCard } from "@/components/recipe-card";
import { recipes as initialRecipes } from "@/data/recipes";
import { useDebounce } from "@/hooks/useDebounce";

export default function RecipePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [recipes, setRecipes] = useState(initialRecipes);

    const debouncedSearch = useDebounce(searchQuery, 300);

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
        <div className="min-h-screen bg-primary">
            <div className="mx-auto max-w-md px-4 py-6">
                {/* Header */}
                <header className="mb-6 flex items-center gap-3">
                    <MobileSidebar />
                    <SearchBar
                        placeholder="Cari resep..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </header>

                {/* Wallet Card */}
                <section className="mb-8">
                    <WalletCard balance={40000} />
                </section>

                {/* Discover Recipes */}
                <section>
                    <h2 className="mb-4 text-xl font-bold text-primary-foreground">
                        Discover
                        <br />
                        New Recipe
                    </h2>

                    <div className="flex flex-col gap-4">
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>

                    {filteredRecipes.length === 0 && (
                        <p className="text-center text-primary-foreground/60">
                            Resep tidak ditemukan.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}
