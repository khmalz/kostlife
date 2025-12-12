import { getDocuments, queryDocuments } from "@/lib/firebase/firestore";
import { convertFirestoreTimestamps } from "@/lib/utils";
import type { Recipe } from "@/types/recipes";

export interface RecipeWithImageURL extends Recipe {
    imageURL: string;
    isFavorite: boolean;
}

/**
 * Check if the image path is an external URL (e.g., picsum, unsplash, etc.)
 * @param imagePath - Image path or URL
 * @returns true if it's an external URL
 */
const isExternalURL = (imagePath: string): boolean => {
    return imagePath.startsWith("http://") || imagePath.startsWith("https://");
};

/**
 * Resolve image URL - use directly if external URL, otherwise use as local asset path
 * @param imagePath - Path to local asset or external URL
 * @returns The URL to use for displaying the image
 */
const resolveImageURL = (imagePath: string): string => {
    // If imagePath is already an external URL (http/https), return it as-is
    if (isExternalURL(imagePath)) {
        return imagePath;
    }
    // Otherwise, return as local asset path (e.g., /assets/recipes/xxx.jpg)
    return imagePath;
};

/**
 * Transform Firebase recipe data to RecipeWithImageURL
 * @param recipe - Recipe from Firebase
 * @returns Recipe with resolved image URL and default isFavorite
 */
const transformRecipe = (recipe: Recipe): RecipeWithImageURL => {
    const imageURL = resolveImageURL(recipe.image);

    // Convert Firestore Timestamps to ISO strings
    const converted = convertFirestoreTimestamps({
        ...recipe,
        imageURL,
        isFavorite: false,
    });

    return converted as RecipeWithImageURL;
};

// ==================== RECIPE FUNCTIONS ====================

/**
 * Get a single recipe by ID (slug field, not document ID)
 * @param recipeId - The recipe ID (slug)
 * @returns Recipe with resolved image URL
 */
export const getRecipe = async (
    recipeId: string,
): Promise<RecipeWithImageURL | null> => {
    try {
        // Query by 'id' field (slug) instead of document ID
        const recipes = await queryDocuments<Recipe>(
            "recipes",
            [{ field: "id", operator: "==", value: recipeId }],
            undefined,
            "asc",
            1,
        );

        if (recipes.length === 0) {
            return null;
        }

        return transformRecipe(recipes[0]);
    } catch (error) {
        console.error("Error getting recipe:", error);
        return null;
    }
};

/**
 * Get all recipes
 * @returns Array of recipes with resolved image URLs
 */
export const getAllRecipes = async (): Promise<RecipeWithImageURL[]> => {
    try {
        const recipes = await getDocuments<Recipe>("recipes");

        // Transform all recipes
        const recipesWithURLs = recipes.map(transformRecipe);

        return recipesWithURLs.map((recipe) =>
            convertFirestoreTimestamps(recipe),
        ) as RecipeWithImageURL[];
    } catch (error) {
        console.error("Error getting all recipes:", error);
        return [];
    }
};

/**
 * Get recipes by price range
 * @param maxPrice - Maximum price filter
 * @returns Array of recipes within price range
 */
export const getRecipesByMaxPrice = async (
    maxPrice: number,
): Promise<RecipeWithImageURL[]> => {
    try {
        const recipes = await queryDocuments<Recipe>(
            "recipes",
            [{ field: "price", operator: "<=", value: maxPrice }],
            "price",
            "asc",
        );

        const recipesWithURLs = recipes.map(transformRecipe);

        return recipesWithURLs.map((recipe) =>
            convertFirestoreTimestamps(recipe),
        ) as RecipeWithImageURL[];
    } catch (error) {
        console.error("Error getting recipes by price:", error);
        return [];
    }
};

/**
 * Get recipes by max calories
 * @param maxCalories - Maximum calories filter
 * @returns Array of recipes within calorie limit
 */
export const getRecipesByMaxCalories = async (
    maxCalories: number,
): Promise<RecipeWithImageURL[]> => {
    try {
        const recipes = await queryDocuments<Recipe>(
            "recipes",
            [{ field: "calories", operator: "<=", value: maxCalories }],
            "calories",
            "asc",
        );

        const recipesWithURLs = recipes.map(transformRecipe);

        return recipesWithURLs.map((recipe) =>
            convertFirestoreTimestamps(recipe),
        ) as RecipeWithImageURL[];
    } catch (error) {
        console.error("Error getting recipes by calories:", error);
        return [];
    }
};

/**
 * Get recipes by max cook time
 * @param maxCookTime - Maximum cook time in minutes
 * @returns Array of recipes within cook time limit
 */
export const getRecipesByMaxCookTime = async (
    maxCookTime: number,
): Promise<RecipeWithImageURL[]> => {
    try {
        const recipes = await queryDocuments<Recipe>(
            "recipes",
            [{ field: "cookTime", operator: "<=", value: maxCookTime }],
            "cookTime",
            "asc",
        );

        const recipesWithURLs = recipes.map(transformRecipe);

        return recipesWithURLs.map((recipe) =>
            convertFirestoreTimestamps(recipe),
        ) as RecipeWithImageURL[];
    } catch (error) {
        console.error("Error getting recipes by cook time:", error);
        return [];
    }
};

/**
 * Search recipes by title (client-side filtering)
 * Note: Firestore doesn't support native text search, so we fetch all and filter
 * @param searchTerm - Search term for title
 * @returns Array of matching recipes
 */
export const searchRecipesByTitle = async (
    searchTerm: string,
): Promise<RecipeWithImageURL[]> => {
    try {
        const allRecipes = await getAllRecipes();
        const lowerSearchTerm = searchTerm.toLowerCase();

        return allRecipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(lowerSearchTerm),
        );
    } catch (error) {
        console.error("Error searching recipes:", error);
        return [];
    }
};
