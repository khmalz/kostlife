"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, User, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarLinks = [
    {
        href: "/recipe",
        label: "Recipe",
        icon: UtensilsCrossed,
    },
    {
        href: "/profile",
        label: "Profile",
        icon: User,
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
                    variant="ghost"
                    size="icon"
                    className="size-10 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                    <Menu className="size-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-primary p-0">
                <SheetHeader className="p-6">
                    <SheetTitle className="text-left text-xl font-bold text-primary-foreground">
                        KostLife
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 px-4">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-primary-foreground transition-colors hover:bg-secondary"
                        >
                            <link.icon className="size-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    ))}
                </div>
                <Separator className="my-4 bg-secondary" />
                <div className="px-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-primary-foreground transition-colors hover:bg-destructive/20"
                    >
                        <LogOut className="size-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
