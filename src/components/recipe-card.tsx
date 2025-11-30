"use client";

import { Heart, Flame, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/types/recipes";
import { cn } from "@/lib/utils";

interface RecipeWithFavorite extends Recipe {
    isFavorite: boolean;
}

interface RecipeCardProps {
    recipe: RecipeWithFavorite;
    onFavoriteToggle?: (id: string) => void;
}

export function RecipeCard({ recipe, onFavoriteToggle }: RecipeCardProps) {
    const formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
    }).format(recipe.price);

    return (
        <div className="flex gap-4 rounded-2xl bg-secondary/50 p-3">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold leading-tight text-primary-foreground">
                        {recipe.title}
                    </h3>
                    <button
                        onClick={() => onFavoriteToggle?.(recipe.id)}
                        className="shrink-0"
                    >
                        <Heart
                            className={cn(
                                "size-5 transition-colors",
                                recipe.isFavorite
                                    ? "fill-accent text-accent"
                                    : "text-primary-foreground/60",
                            )}
                        />
                    </button>
                </div>

                <p className="text-sm font-semibold text-primary-foreground">
                    Rp. {formattedPrice},00
                </p>

                <div className="flex items-center gap-3 text-xs text-primary-foreground/70">
                    <span className="flex items-center gap-1">
                        <Flame className="size-3" />± {recipe.calories} Kkal
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {recipe.cookTime} min
                    </span>
                </div>

                <Link
                    href={`/recipe/${recipe.id}`}
                    className="flex items-center gap-1 self-end text-sm font-medium text-accent"
                >
                    Learn More
                    <ChevronRight className="size-4" />
                </Link>
            </div>
        </div>
    );
}
