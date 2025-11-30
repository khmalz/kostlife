"use client";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/nav-item";

interface NavbarProps {
    isLoggedIn?: boolean;
    onLogin?: () => void;
    onLogout?: () => void;
}

export function Navbar({ isLoggedIn = false, onLogin, onLogout }: NavbarProps) {
    const pathname = usePathname();

    const handleLogin = () => {
        onLogin?.();
        console.log("Login clicked");
    };

    const handleLogout = () => {
        onLogout?.();
        console.log("Logout clicked");
    };

    return (
        <header className="hidden md:block w-full bg-primary">
            <div className="mx-auto max-w-7xl px-6 py-2">
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/assets/logo-light.png"
                            alt="KostLife"
                            width={120}
                            height={48}
                            className="size-23"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <ul className="flex items-center gap-8">
                        {navItems.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-base font-medium transition-colors hover:text-primary-foreground",
                                        pathname === link.href
                                            ? "text-primary-foreground"
                                            : "text-primary-foreground/70",
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2">
                        {isLoggedIn ? (
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="text-primary-foreground text-base hover:bg-secondary hover:text-primary-foreground"
                            >
                                <LogOut className="size-4 mr-2" />
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={handleLogin}
                                className="text-primary-foreground text-base hover:bg-secondary hover:text-primary-foreground"
                            >
                                <LogIn className="size-4 mr-2" />
                                Login
                            </Button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
