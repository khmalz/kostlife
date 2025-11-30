import { getRecipe } from "@/lib/services/server/recipe.service";
import type { RecipeWithImageURL } from "@/lib/services/server/recipe.service";
import { cacheTag } from "next/cache";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { notFound } from "next/navigation";
import RecipeDetailClient from "@/components/pages/recipe-detail";

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getCachedRecipe(
    recipeId: string,
): Promise<RecipeWithImageURL | null> {
    "use cache";
    cacheTag(`recipe-${recipeId}`);
    cacheLife({
        stale: 60 * 60 * 24 * 7, // 7 days
        revalidate: 60 * 60 * 24 * 8, // 8 days
        expire: 60 * 60 * 24 * 10, // 10 days
    });

    try {
        const recipe = await getRecipe(recipeId);

        if (!recipe) {
            return null;
        }

        return {
            ...recipe,
            image: recipe.imageURL || recipe.image,
        };
    } catch (err) {
        console.error("Error fetching recipe:", err);
        return null;
    }
}

export default async function RecipeDetailPage({ params }: PageProps) {
    const { id } = await params;
    const recipe = await getCachedRecipe(id);

    if (!recipe) {
        notFound();
    }

    return <RecipeDetailClient recipe={recipe} />;
}
