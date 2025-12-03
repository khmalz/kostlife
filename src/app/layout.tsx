import type { Metadata, Viewport } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const lexend = Lexend_Deca({
    variable: "--font-lexend",
    subsets: ["latin"],
});

export function generateViewport(): Viewport {
    return {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        themeColor: "green",
    };
}

export const metadata: Metadata = {
    title: "KostLife",
    description: "Kostlife - Teman Setia Anak Kost!",
    icons: {
        icon: "/favicon.ico",
    },
    metadataBase: new URL("https://kostlife.vercel.app"),
    alternates: {
        canonical: "/",
        languages: {
            id: "/",
        },
    },
    openGraph: {
        images: "/assets/preview.webp",
        title: "KostLife",
        type: "website",
        countryName: "Indonesia",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${lexend.className} antialiased`}>
                <AuthProvider>
                    {children}
                    <Toaster position="bottom-right" richColors />
                </AuthProvider>
            </body>
        </html>
    );
}
