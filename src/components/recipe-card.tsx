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
        <div className="flex overflow-hidden rounded-2xl bg-primary">
            <div className="relative w-2/5 shrink-0 md:w-32">
                <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 112px, 128px"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between p-3 md:p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold leading-tight text-secondary-foreground md:text-lg md:leading-snug">
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
                                "size-5 transition-colors md:size-6",
                                recipe.isFavorite
                                    ? "fill-accent text-accent"
                                    : "text-secondary-foreground/70",
                            )}
                        />
                    </button>
                </div>

                <div className="h-px p-0.5 my-2 bg-secondary w-full md:my-1.5 rounded-lg" />

                <div className="flex flex-col gap-y-1.5 md:gap-y-1">
                    <p className="text-sm font-medium text-secondary-foreground md:text-base">
                        Rp. {formattedPrice},00
                    </p>

                    <div className="flex flex-col gap-1 text-sm text-secondary-foreground/80">
                        <span className="flex items-center gap-1">
                            <Flame className="size-3 md:size-2.5" />±{" "}
                            {recipe.calories} Kkal
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="size-3 md:size-2.5" />
                            {recipe.cookTime} min
                        </span>
                    </div>
                </div>

                {/* Learn More Link */}
                <Link
                    href={`/recipe/${recipe.id}`}
                    className="flex items-center gap-1 self-end text-sm font-medium text-secondary-foreground md:text-base mt-2 md:mt-3"
                >
                    Learn More
                    <ChevronRight className="size-5 md:size-6" />
                </Link>
            </div>
        </div>
    );
}
