import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen bg-primary flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center justify-center gap-4 px-4 py-8">
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-8">
                        <Image
                            src="/assets/logo-light.png"
                            alt="KostLife Logo"
                            width={300}
                            height={300}
                            priority
                            className="mx-auto w-64 h-64 md:w-80 md:h-80"
                            style={{ height: "auto" }}
                        />
                        <p className="text-lg text-primary-foreground text-center">
                            Teman Setia Anak Kost!
                        </p>
                        <a
                            href="/recipe"
                            className="mt-6 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold text-lg shadow-lg transition hover:bg-secondary/80"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
