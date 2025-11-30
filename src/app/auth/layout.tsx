import React, { Suspense } from "react";
import Image from "next/image";

type Props = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="min-h-screen w-full flex flex-col items-center justify-start py-16 px-6">
                {/* Logo / Brand */}
                <header className="flex flex-col items-center mb-8">
                    <div className="w-48 h-48 flex items-center justify-center">
                        <Image
                            width={500}
                            height={500}
                            src="/assets/logo.png"
                            alt="KostLife logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </header>

                {/* Centered card container - children will be the specific auth form */}
                <section
                    role="region"
                    aria-label="Authentication"
                    className="w-full flex justify-center"
                >
                    <div className="max-w-md w-full rounded-2xl shadow-lg p-8 bg-secondary text-secondary-foreground border border-border">
                        <Suspense
                            fallback={
                                <div className="flex justify-center py-8">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
                                </div>
                            }
                        >
                            {children}
                        </Suspense>
                    </div>
                </section>
            </main>
        </div>
    );
}
