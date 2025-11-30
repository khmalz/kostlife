export function AuthFormSkeleton({ type }: { type: "login" | "register" }) {
    return (
        <div className="w-full space-y-6 animate-pulse">
            <div className="flex justify-center">
                <div className="h-9 w-24 rounded-lg bg-background/20" />
            </div>

            <div className="space-y-4">
                <div className="h-12 w-full rounded-full bg-accent/50" />

                <div className="h-12 w-full rounded-full bg-accent/50" />

                {type === "register" && (
                    <div className="h-12 w-full rounded-full bg-accent/50" />
                )}

                <div className="pt-2">
                    <div className="h-12 w-full rounded-full bg-primary/50" />
                </div>

                <div className="flex justify-center pt-1">
                    <div className="h-4 w-40 rounded bg-secondary-foreground/20" />
                </div>
            </div>
        </div>
    );
}
