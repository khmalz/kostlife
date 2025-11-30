'use client';

import {
    getDocument,
    getDocuments,
    queryDocuments,
} from '@/lib/firebase/firestore';
import { getImageURL } from '@/lib/firebase/storage';
import type { Recipe } from '@/types/recipes';

export interface RecipeWithImageURL extends Recipe {
  imageURL: string;
}

/**
 * Check if the image path is an external URL (e.g., picsum, unsplash, etc.)
 * @param imagePath - Image path or URL
 * @returns true if it's an external URL
 */
const isExternalURL = (imagePath: string): boolean => {
  return imagePath.startsWith('http://') || imagePath.startsWith('https://');
};

/**
 * Resolve image URL - use directly if external URL, otherwise fetch from Firebase Storage
 * @param imagePath - Path in Firebase Storage or external URL
 * @returns Full download URL or the original URL
 */
const resolveImageURL = async (imagePath: string): Promise<string> => {
  try {
    // If imagePath is already an external URL (picsum, etc.), return it as-is
    if (isExternalURL(imagePath)) {
      return imagePath;
    }
    // Otherwise, get from Firebase Storage
    return await getImageURL(imagePath);
  } catch {
    return '';
  }
};

/**
 * Transform Firebase recipe data to RecipeWithImageURL
 * @param recipe - Recipe from Firebase
 * @returns Recipe with resolved image URL
 */
const transformRecipe = async (recipe: Recipe): Promise<RecipeWithImageURL> => {
  const imageURL = await resolveImageURL(recipe.image);
  return {
    ...recipe,
    imageURL,
  };
};

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

    return await transformRecipe(recipe);
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

    // Resolve all image URLs in parallel
    const recipesWithURLs = await Promise.all(
      recipes.map(transformRecipe)
    );

    return recipesWithURLs;
  } catch (error) {
    console.error('Error getting all recipes:', error);
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
      recipes.map(transformRecipe)
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
      recipes.map(transformRecipe)
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
      recipes.map(transformRecipe)
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
