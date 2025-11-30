export default function RecipeDetailLoading() {
    return (
        <div className="min-h-screen bg-primary animate-pulse">
            <div className="h-16 bg-secondary/20" />

            {/* Mobile Header Skeleton */}
            <header className="flex items-center justify-center relative px-4 py-4 md:hidden">
                <div className="absolute left-4 size-10 rounded-lg bg-secondary/20" />
                <div className="h-6 w-20 rounded bg-secondary/20" />
            </header>

            <main className="px-4 pb-8 md:px-8 md:py-10 md:max-w-6xl md:mx-auto">
                {/* Desktop Back Button Skeleton */}
                <div className="hidden md:flex items-center gap-2 mb-6">
                    <div className="size-5 rounded bg-secondary/20" />
                    <div className="h-5 w-20 rounded bg-secondary/20" />
                </div>

                <div className="md:flex md:gap-10">
                    {/* Image Skeleton */}
                    <section className="mb-6 md:mb-0 md:w-2/5 md:shrink-0">
                        <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl bg-secondary/20" />
                    </section>

                    <div className="md:flex-1">
                        {/* Title & Price Skeleton */}
                        <section className="mb-4 md:mb-6">
                            <div className="h-8 w-3/4 rounded bg-secondary/20 mb-2" />
                            <div className="h-5 w-32 rounded bg-secondary/20" />
                        </section>

                        <div className="h-px bg-secondary/20 w-full mb-4 md:mb-6" />

                        {/* Calories & Time Skeleton */}
                        <section className="flex items-center gap-6 mb-6 md:mb-8">
                            <div className="h-5 w-24 rounded bg-secondary/20" />
                            <div className="h-5 w-20 rounded bg-secondary/20" />
                        </section>

                        {/* Ingredients Skeleton */}
                        <section className="mb-6 md:mb-8">
                            <div className="inline-block h-9 w-40 rounded-lg bg-secondary/20 mb-4" />
                            <div className="space-y-2">
                                <div className="h-4 w-[85%] rounded bg-secondary/20" />
                                <div className="h-4 w-[75%] rounded bg-secondary/20" />
                                <div className="h-4 w-[90%] rounded bg-secondary/20" />
                                <div className="h-4 w-[70%] rounded bg-secondary/20" />
                                <div className="h-4 w-[80%] rounded bg-secondary/20" />
                            </div>
                        </section>

                        {/* Instructions Skeleton */}
                        <section>
                            <div className="inline-block h-9 w-32 rounded-lg bg-secondary/20 mb-4" />
                            <div className="space-y-3">
                                <div className="h-4 w-[95%] rounded bg-secondary/20" />
                                <div className="h-4 w-[88%] rounded bg-secondary/20" />
                                <div className="h-4 w-[92%] rounded bg-secondary/20" />
                                <div className="h-4 w-[85%] rounded bg-secondary/20" />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
