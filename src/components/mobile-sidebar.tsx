"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutDialog } from "@/components/logout-dialog";
import { navItems } from "@/data/nav-item";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogin = () => {
        setOpen(false);
        router.push("/auth/login");
    };

    const handleLogout = () => {
        logout();
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="size-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80"
                >
                    <Menu className="size-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-primary p-0">
                <div className="flex items-center w-full px-6 py-2">
                    <SheetClose
                        aria-label="Close menu"
                        className="inline-flex size-8 items-center justify-center rounded-md text-primary-foreground/80 hover:bg-secondary/40 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X className="size-7" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                    <SheetTitle asChild>
                        <Link
                            href="/"
                            className="ml-auto"
                            onClick={() => setOpen(false)}
                        >
                            <Image
                                src="/assets/logo-light.png"
                                alt="KostLife"
                                width={100}
                                height={40}
                                className="size-18 w-auto"
                            />
                        </Link>
                    </SheetTitle>
                </div>

                {isAuthenticated && user && (
                    <>
                        <div className="px-4 py-3">
                            <div className="flex items-center gap-3 rounded-lg bg-secondary/20 px-3 py-2">
                                <div className="flex size-10 items-center justify-center rounded-full bg-secondary/40">
                                    <User className="size-5 text-primary-foreground" />
                                </div>
                                <span className="text-sm font-semibold text-primary-foreground">
                                    {user.username}
                                </span>
                            </div>
                        </div>
                        <Separator className="bg-secondary/50" />
                    </>
                )}

                <nav className="flex flex-col gap-2 px-4 py-4">
                    {navItems.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-primary-foreground text-base transition-colors hover:bg-secondary"
                        >
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <Separator className="my-2 bg-secondary" />

                <div className="px-4">
                    {isAuthenticated ? (
                        <LogoutDialog
                            onConfirm={handleLogout}
                            trigger={
                                <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary-foreground text-base transition-colors hover:bg-destructive/20">
                                    <LogOut className="size-4" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            }
                        />
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary-foreground text-base transition-colors hover:bg-secondary"
                        >
                            <LogIn className="size-4" />
                            <span className="font-medium">Login</span>
                        </button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
