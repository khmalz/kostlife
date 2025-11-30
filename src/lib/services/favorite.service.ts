import {
    addDocument,
    queryDocuments,
    updateDocument,
} from '@/lib/firebase/firestore';

export interface UserFavorites {
    id: string;
    user_id: string;
    favorite_recipe_ids: string[];
    createdAt: string;
    updatedAt?: string;
}

const COLLECTION_NAME = 'user_favorites'

export const getUserFavorites = async (
    userId: string
): Promise<UserFavorites | null> => {
    try {
        const favorites = await queryDocuments<UserFavorites>(
            COLLECTION_NAME,
            [{ field: 'user_id', operator: '==', value: userId }]
        );

        return favorites.length > 0 ? favorites[0] : null;
    } catch (error) {
        console.error('Get favorites error:', error);
        return null;
    }
};

export const getFavoriteRecipeIds = async (
    userId: string
): Promise<string[]> => {
    const favorites = await getUserFavorites(userId);
    return favorites?.favorite_recipe_ids || [];
};

export const isRecipeFavorited = async (
    userId: string,
    recipeId: string
): Promise<boolean> => {
    const favoriteIds = await getFavoriteRecipeIds(userId);
    return favoriteIds.includes(recipeId);
};

export const addToFavorites = async (
    userId: string,
    recipeId: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const existingFavorites = await getUserFavorites(userId);

        if (existingFavorites) {
            // Check if already favorited
            if (existingFavorites.favorite_recipe_ids.includes(recipeId)) {
                return { success: true };
            }

            await updateDocument(COLLECTION_NAME, existingFavorites.id, {
                favorite_recipe_ids: [
                    ...existingFavorites.favorite_recipe_ids,
                    recipeId,
                ],
                updatedAt: new Date().toISOString(),
            });
        } else {
            await addDocument(COLLECTION_NAME, {
                user_id: userId,
                favorite_recipe_ids: [recipeId],
                createdAt: new Date().toISOString(),
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Add to favorites error:', error);
        return { success: false, error: 'Gagal menambahkan ke favorit' };
    }
};

export const removeFromFavorites = async (
    userId: string,
    recipeId: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const existingFavorites = await getUserFavorites(userId);

        if (!existingFavorites) {
            return { success: true };
        }

        const updatedFavorites = existingFavorites.favorite_recipe_ids.filter(
            (id) => id !== recipeId
        );

        await updateDocument(COLLECTION_NAME, existingFavorites.id, {
            favorite_recipe_ids: updatedFavorites,
            updatedAt: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('Remove from favorites error:', error);
        return { success: false, error: 'Gagal menghapus dari favorit' };
    }
};

export const toggleFavorite = async (
    userId: string,
    recipeId: string
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> => {
    try {
        const currentlyFavorited = await isRecipeFavorited(userId, recipeId);

        if (currentlyFavorited) {
            const result = await removeFromFavorites(userId, recipeId);
            return { ...result, isFavorited: false };
        } else {
            const result = await addToFavorites(userId, recipeId);
            return { ...result, isFavorited: true };
        }
    } catch (error) {
        console.error('Toggle favorite error:', error);
        return { success: false, error: 'Gagal mengubah status favorit' };
    }
};
