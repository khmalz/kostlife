'use client';

import {
    getDocument,
    getDocuments,
    queryDocuments,
} from '@/lib/firebase/firestore';
import { getImageURL } from '@/lib/firebase/storage';

// ==================== TYPES ====================

export interface Recipe {
  id: string;
  title: string;
  price: number;
  calories: number;
  cookTime: number;
  image: string; // Path in Firebase Storage
  isFavorite: boolean;
  ingredients: string[];
  instructions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeWithImageURL extends Recipe {
  imageURL: string; // Full download URL from Storage
}

// ==================== RECIPE FUNCTIONS ====================

/**
 * Get a single recipe by ID
 * @param recipeId - The recipe document ID
 * @returns Recipe with resolved image URL
 */
export const getRecipe = async (
  recipeId: string
): Promise<RecipeWithImageURL | null> => {
  try {
    const recipe = await getDocument<Recipe>('recipes', recipeId);

    if (!recipe) {
      return null;
    }

    // Get image URL from storage
    const imageURL = await getImageURL(recipe.image);

    return {
      ...recipe,
      imageURL,
    };
  } catch (error) {
    console.error('Error getting recipe:', error);
    return null;
  }
};

/**
 * Get all recipes
 * @returns Array of recipes with resolved image URLs
 */
export const getAllRecipes = async (): Promise<RecipeWithImageURL[]> => {
  try {
    const recipes = await getDocuments<Recipe>('recipes');

    // Resolve all image URLs
    const recipesWithURLs = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const imageURL = await getImageURL(recipe.image);
          return { ...recipe, imageURL };
        } catch {
          // Return empty string if image not found
          return { ...recipe, imageURL: '' };
        }
      })
    );

    return recipesWithURLs;
  } catch (error) {
    console.error('Error getting all recipes:', error);
    return [];
  }
};

/**
 * Get favorite recipes
 * @returns Array of favorite recipes with resolved image URLs
 */
export const getFavoriteRecipes = async (): Promise<RecipeWithImageURL[]> => {
  try {
    const recipes = await queryDocuments<Recipe>(
      'recipes',
      [{ field: 'isFavorite', operator: '==', value: true }]
    );

    const recipesWithURLs = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const imageURL = await getImageURL(recipe.image);
          return { ...recipe, imageURL };
        } catch {
          return { ...recipe, imageURL: '' };
        }
      })
    );

    return recipesWithURLs;
  } catch (error) {
    console.error('Error getting favorite recipes:', error);
    return [];
  }
};

/**
 * Get recipes by price range
 * @param maxPrice - Maximum price filter
 * @returns Array of recipes within price range
 */
export const getRecipesByMaxPrice = async (
  maxPrice: number
): Promise<RecipeWithImageURL[]> => {
  try {
    const recipes = await queryDocuments<Recipe>(
      'recipes',
      [{ field: 'price', operator: '<=', value: maxPrice }],
      'price',
      'asc'
    );

    const recipesWithURLs = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const imageURL = await getImageURL(recipe.image);
          return { ...recipe, imageURL };
        } catch {
          return { ...recipe, imageURL: '' };
        }
      })
    );

    return recipesWithURLs;
  } catch (error) {
    console.error('Error getting recipes by price:', error);
    return [];
  }
};

/**
 * Get recipes by max calories
 * @param maxCalories - Maximum calories filter
 * @returns Array of recipes within calorie limit
 */
export const getRecipesByMaxCalories = async (
  maxCalories: number
): Promise<RecipeWithImageURL[]> => {
  try {
    const recipes = await queryDocuments<Recipe>(
      'recipes',
      [{ field: 'calories', operator: '<=', value: maxCalories }],
      'calories',
      'asc'
    );

    const recipesWithURLs = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const imageURL = await getImageURL(recipe.image);
          return { ...recipe, imageURL };
        } catch {
          return { ...recipe, imageURL: '' };
        }
      })
    );

    return recipesWithURLs;
  } catch (error) {
    console.error('Error getting recipes by calories:', error);
    return [];
  }
};

/**
 * Get recipes by max cook time
 * @param maxCookTime - Maximum cook time in minutes
 * @returns Array of recipes within cook time limit
 */
export const getRecipesByMaxCookTime = async (
  maxCookTime: number
): Promise<RecipeWithImageURL[]> => {
  try {
    const recipes = await queryDocuments<Recipe>(
      'recipes',
      [{ field: 'cookTime', operator: '<=', value: maxCookTime }],
      'cookTime',
      'asc'
    );

    const recipesWithURLs = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const imageURL = await getImageURL(recipe.image);
          return { ...recipe, imageURL };
        } catch {
          return { ...recipe, imageURL: '' };
        }
      })
    );

    return recipesWithURLs;
  } catch (error) {
    console.error('Error getting recipes by cook time:', error);
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
  searchTerm: string
): Promise<RecipeWithImageURL[]> => {
  try {
    const allRecipes = await getAllRecipes();
    const lowerSearchTerm = searchTerm.toLowerCase();

    return allRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};
