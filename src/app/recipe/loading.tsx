export default function RecipeLoading() {
    return (
        <div className="min-h-screen bg-secondary animate-pulse">
            <div className="h-16 bg-primary/20" />

            <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                <header className="mb-6 flex items-center gap-3 md:hidden">
                    <div className="size-10 rounded-full bg-primary/20" />
                    <div className="h-10 flex-1 rounded-full bg-primary/20" />
                </header>

                <div className="hidden md:flex md:items-center md:justify-center md:gap-4 md:mb-8 md:max-w-lg md:mx-auto">
                    <div className="h-10 flex-1 rounded-full bg-primary/20" />
                    <div className="size-10 rounded-full bg-primary/20" />
                </div>

                <section>
                    <div className="mb-4 md:mb-6">
                        <div className="h-7 w-32 rounded bg-primary/20 mb-2" />
                        <div className="h-7 w-40 rounded bg-primary/20" />
                    </div>

                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl bg-primary/10 overflow-hidden"
                            >
                                <div className="h-40 bg-primary/20" />
                                <div className="p-4 space-y-3">
                                    <div className="h-5 w-3/4 rounded bg-primary/20" />
                                    <div className="h-4 w-1/2 rounded bg-primary/20" />
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="h-6 w-20 rounded bg-primary/20" />
                                        <div className="size-8 rounded-full bg-primary/20" />
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
