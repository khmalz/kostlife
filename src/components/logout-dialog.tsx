"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { ReactNode } from "react";

interface LogoutDialogProps {
    onConfirm: () => void;
    trigger?: ReactNode;
    triggerClassName?: string;
}

export function LogoutDialog({
    onConfirm,
    trigger,
    triggerClassName,
}: LogoutDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <button className={triggerClassName}>
                        <LogOut className="size-4 mr-2" />
                        Logout
                    </button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                    >
                        Yes, Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
