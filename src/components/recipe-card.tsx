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
        <div className="flex gap-4 rounded-2xl bg-primary p-3">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-xl">
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
                    <h3 className="text-base font-semibold leading-tight text-secondary-foreground">
                        {recipe.title.length > 25
                            ? `${recipe.title.substring(0, 25)}...`
                            : recipe.title}
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
                                    : "text-secondary-foreground/60",
                            )}
                        />
                    </button>
                </div>

                <div className="h-1 rounded-lg my-3 bg-secondary w-full border-secondary" />

                <div className="flex flex-col gap-y-2">
                    <p className="text-sm font-medium text-secondary-foreground">
                        Rp. {formattedPrice},00
                    </p>

                    <div className="flex flex-col gap-2 text-sm text-secondary-foreground/80">
                        <span className="flex items-center gap-1">
                            <Flame className="size-3" />± {recipe.calories} Kkal
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {recipe.cookTime} min
                        </span>
                    </div>
                </div>

                <Link
                    href={`/recipe/${recipe.id}`}
                    className="flex items-center gap-1 self-end text-sm font-medium text-secondary-foreground"
                >
                    Learn More
                    <ChevronRight className="size-5" />
                </Link>
            </div>
        </div>
    );
}
