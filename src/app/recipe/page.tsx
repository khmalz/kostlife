import { getAllRecipes } from "@/lib/services/server/recipe.service";
import type { RecipeWithImageURL } from "@/lib/services/server/recipe.service";
import RecipePageClient from "@/components/pages/recipe";
import { cacheTag } from "next/cache";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

async function getCachedRecipes(): Promise<
    RecipeWithImageURL[] | { error: string }
> {
    "use cache";
    cacheTag("recipes");
    cacheLife({
        stale: 60 * 60 * 24 * 7, // 7 days
        revalidate: 60 * 60 * 24 * 8, // 8 days
        expire: 60 * 60 * 24 * 10, // 10 days
    });

    try {
        const fetchedRecipes = await getAllRecipes();

        const recipesWithResolvedImages = fetchedRecipes.map((recipe) => ({
            ...recipe,
            image: recipe.imageURL || recipe.image,
        }));

        return recipesWithResolvedImages;
    } catch (err) {
        console.error("Error fetching recipes:", err);
        return { error: "Gagal memuat resep. Silakan coba lagi." };
    }
}

export default async function RecipePage() {
    const recipesData = await getCachedRecipes();

    if ("error" in recipesData) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center">
                <p className="text-center text-red-400">{recipesData.error}</p>
            </div>
        );
    }

    return <RecipePageClient initialRecipes={recipesData} />;
}
