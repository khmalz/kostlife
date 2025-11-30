"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarLinks = [
    {
        href: "/recipe",
        label: "Recipe",
    },
    {
        href: "/profile",
        label: "Profile",
    },
];

export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        // Handle logout logic here
        console.log("Logout clicked");
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
                <div className="flex items-center w-full px-6 py-6">
                    <SheetClose
                        aria-label="Close menu"
                        className="inline-flex size-8 items-center justify-center rounded-md text-primary-foreground/80 hover:bg-secondary/40 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X className="size-7" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                    <SheetTitle asChild>
                        <h2 className="text-2xl font-bold text-primary-foreground m-0 ml-auto">
                            KostLife
                        </h2>
                    </SheetTitle>
                </div>

                <nav className="flex flex-col gap-2 px-4">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-primary-foreground text-lg transition-colors hover:bg-secondary"
                        >
                            <span className="font-medium ">{link.label}</span>
                        </Link>
                    ))}
                </nav>
                <Separator className="my-4 bg-secondary" />
                <div className="px-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary-foreground text-lg transition-colors hover:bg-destructive/20"
                    >
                        <LogOut className="size-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
