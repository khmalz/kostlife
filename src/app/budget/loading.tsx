export default function BudgetLoading() {
    return (
        <div className="min-h-screen bg-secondary animate-pulse">
            {/* Desktop Navbar Skeleton */}
            <header className="hidden md:block w-full bg-primary">
                <div className="mx-auto max-w-7xl px-6 py-2">
                    <nav className="flex items-center justify-between">
                        <div className="h-12 w-28 rounded bg-primary-foreground/20" />
                        <div className="flex items-center gap-8">
                            <div className="h-4 w-16 rounded bg-primary-foreground/20" />
                            <div className="h-4 w-16 rounded bg-primary-foreground/20" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-20 rounded bg-primary-foreground/20" />
                            <div className="h-9 w-24 rounded bg-primary-foreground/20" />
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content - Centered layout */}
            <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                {/* Mobile Header Skeleton */}
                <header className="mb-6 flex items-center gap-3 md:hidden">
                    <div className="size-10 rounded-lg bg-primary/20" />
                    <div className="flex-1 h-10 rounded-full bg-background/50" />
                </header>

                {/* Desktop Search Bar with Filter Button - Centered */}
                <div className="hidden md:flex md:items-center md:justify-center md:gap-4 md:mb-8 md:max-w-xl md:mx-auto">
                    <div className="flex-1 h-10 rounded-full bg-background/50" />
                    <div className="size-10 rounded-full bg-primary/50" />
                </div>

                {/* Wallet Card - Centered */}
                <section className="mb-8 md:flex md:justify-center">
                    <div className="md:w-full md:max-w-lg rounded-3xl bg-primary p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="size-6 rounded bg-primary-foreground/20" />
                                    <div className="h-4 w-20 rounded bg-primary-foreground/20" />
                                </div>
                                <div className="h-3 w-14 rounded bg-primary-foreground/20 mb-2" />
                                <div className="h-7 w-32 rounded bg-primary-foreground/20" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="size-8 rounded-full bg-primary-foreground/20" />
                                <div className="h-3 w-12 rounded bg-primary-foreground/20" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transactions Section Skeleton */}
                <section>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="h-6 w-32 rounded bg-primary/30 md:h-7" />
                        {/* Filter Button Skeleton - Mobile */}
                        <div className="md:hidden size-10 rounded-full bg-primary/50" />
                    </div>

                    {/* Transaction Cards Skeleton */}
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-secondary overflow-hidden"
                            >
                                {/* Header skeleton */}
                                <div className="px-4 py-3 bg-primary/20">
                                    <div className="flex items-center gap-2">
                                        <div className="size-5 rounded bg-secondary-foreground/10" />
                                        <div className="h-5 w-28 rounded bg-secondary-foreground/10" />
                                    </div>
                                </div>
                                {/* Content skeleton */}
                                <div className="px-4 py-3 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="size-4 rounded-full bg-secondary-foreground/10" />
                                        <div className="h-4 w-20 rounded bg-secondary-foreground/10" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-4 rounded bg-secondary-foreground/10" />
                                        <div className="h-4 w-32 rounded bg-secondary-foreground/10" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-4 rounded bg-secondary-foreground/10" />
                                        <div className="h-4 w-36 rounded bg-secondary-foreground/10" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
