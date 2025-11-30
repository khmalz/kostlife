"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toggleFavorite } from "@/lib/services/favorite.service";

interface FavoriteButtonProps {
    recipeId: string;
    initialFavorited?: boolean;
    className?: string;
    iconClassName?: string;
    onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
    recipeId,
    initialFavorited = false,
    className,
    iconClassName,
    onToggle,
}: FavoriteButtonProps) {
    const { user, isAuthenticated } = useAuth();
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isPending, startTransition] = useTransition();

    const handleClick = async (e: React.MouseEvent) => {
        // Prevent event bubbling (e.g., if inside a link)
        e.preventDefault();
        e.stopPropagation();

        // Safety check (should not happen since button is hidden for unauthenticated users)
        if (!user) {
            return;
        }

        // Optimistic update - immediately toggle UI
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);
        onToggle?.(newFavoritedState);

        // Perform async operation in background
        startTransition(async () => {
            try {
                const result = await toggleFavorite(user.id, recipeId);

                if (!result.success) {
                    // Revert on failure
                    setIsFavorited(!newFavoritedState);
                    onToggle?.(!newFavoritedState);
                    console.error("Failed to toggle favorite:", result.error);
                }
            } catch (error) {
                // Revert on error
                setIsFavorited(!newFavoritedState);
                onToggle?.(!newFavoritedState);
                console.error("Error toggling favorite:", error);
            }
        });
    };

    // Don't render if user is not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={cn(
                "shrink-0 transition-transform active:scale-90 disabled:opacity-70",
                className,
            )}
            aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
            }
        >
            <Heart
                className={cn(
                    "size-5 transition-colors md:size-6",
                    isFavorited
                        ? "fill-accent text-accent"
                        : "text-secondary-foreground/70 hover:text-accent/70",
                    isPending && "animate-pulse",
                    iconClassName,
                )}
            />
        </button>
    );
}
