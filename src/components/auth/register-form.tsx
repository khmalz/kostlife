"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function RegisterForm() {
    const router = useRouter();
    const { register, isLoading: authLoading } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        if (!username.trim() || !password || !confirm) {
            return "Please fill in all fields.";
        }
        if (username.trim().length < 3) {
            return "Username must be at least 3 characters.";
        }
        if (password !== confirm) {
            return "Passwords do not match.";
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }
        return null;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const v = validate();
        setErrors(v);
        if (v) return;

        setIsSubmitting(true);

        try {
            const result = await register(username.trim(), password, 0);

            if (result.success) {
                router.push("/recipe");
            } else {
                setErrors(
                    result.error || "Registration failed. Please try again.",
                );
            }
        } catch (error) {
            console.error("Register error:", error);
            setErrors("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = isSubmitting || authLoading;

    return (
        <div className="w-full space-y-6">
            <h2 className="text-center text-3xl font-bold text-background">
                Register
            </h2>

            <form
                onSubmit={onSubmit}
                className="space-y-4"
                aria-label="Register form"
            >
                {errors && (
                    <div
                        role="alert"
                        className="text-sm px-3 py-2 rounded-md text-white bg-destructive"
                    >
                        {errors}
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="sr-only">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        disabled={isLoading}
                        className="w-full py-3 px-5 rounded-full text-sm font-medium bg-accent text-accent-foreground placeholder:text-accent-foreground/70 border-0 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                        autoComplete="username"
                        aria-invalid={!!errors}
                    />
                </div>

                <div className="relative">
                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        disabled={isLoading}
                        className="w-full py-3 px-5 pr-12 rounded-full text-sm font-medium bg-accent text-accent-foreground placeholder:text-accent-foreground/70 border-0 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                        autoComplete="new-password"
                        aria-invalid={!!errors}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        disabled={isLoading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-foreground hover:text-accent-foreground/80 transition-colors disabled:opacity-50"
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {showPassword ? (
                                <>
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </>
                            ) : (
                                <>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                <div className="relative">
                    <label htmlFor="confirm" className="sr-only">
                        Confirm Password
                    </label>
                    <input
                        id="confirm"
                        name="confirm"
                        type={showPassword ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Confirm Password"
                        disabled={isLoading}
                        className="w-full py-3 px-5 pr-12 rounded-full text-sm font-medium bg-accent text-accent-foreground placeholder:text-accent-foreground/70 border-0 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                        autoComplete="new-password"
                        aria-invalid={!!errors}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        disabled={isLoading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-foreground hover:text-accent-foreground/80 transition-colors disabled:opacity-50"
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {showPassword ? (
                                <>
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </>
                            ) : (
                                <>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Registering...</span>
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>
                </div>

                <div className="text-center text-sm text-secondary-foreground/80 pt-1">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="underline font-medium hover:text-background transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
