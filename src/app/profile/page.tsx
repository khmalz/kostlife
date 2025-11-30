import { MobileSidebar } from "@/components/mobile-sidebar";
import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-primary">
            <div className="mx-auto max-w-md px-4 py-6">
                {/* Header */}
                <header className="mb-6 flex items-center gap-3">
                    <MobileSidebar />
                    <h1 className="text-lg font-semibold text-primary-foreground">
                        Profile
                    </h1>
                </header>

                {/* Profile Content */}
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-secondary p-8">
                    <div className="flex size-24 items-center justify-center rounded-full bg-primary">
                        <User className="size-12 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-secondary-foreground">
                            John Doe
                        </h2>
                        <p className="text-sm text-secondary-foreground/70">
                            johndoe@email. com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
