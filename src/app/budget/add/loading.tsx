export default function AddTransactionLoading() {
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

            {/* Main Content */}
            <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                {/* Mobile Header Skeleton */}
                <header className="mb-6 flex items-center md:hidden">
                    <div className="size-10 rounded-lg bg-primary/20" />
                </header>

                {/* Header with Back button skeleton */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="size-5 rounded bg-primary-foreground/20" />
                        <div className="h-5 w-12 rounded bg-primary-foreground/20" />
                    </div>
                    <div className="flex-1 flex justify-center pr-16">
                        <div className="h-7 w-40 rounded bg-primary-foreground/20" />
                    </div>
                </div>

                {/* Form Card Skeleton */}
                <div className="mx-auto max-w-md">
                    <div className="rounded-2xl border-2 border-primary/30 bg-secondary/50 p-6">
                        <div className="flex flex-col gap-4">
                            {/* Select skeleton */}
                            <div className="h-11 rounded-full bg-background/50" />

                            {/* Input skeleton */}
                            <div className="h-11 rounded-full bg-background/50" />

                            {/* Date picker skeleton */}
                            <div className="h-11 rounded-full bg-background/50" />

                            {/* Description skeleton */}
                            <div className="h-11 rounded-full bg-background/50" />

                            {/* Button skeleton */}
                            <div className="h-11 rounded-full bg-primary/30 mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
