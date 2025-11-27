"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<string | null>(null);

    const validate = () => {
        if (!username.trim() || !password) {
            return "Please fill in all fields.";
        }
        if (password.length < 6) {
            return "Password should be at least 6 characters.";
        }
        return null;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (v) return;

        console.log("Login:", { username, password });
        alert(`Logged in (demo): ${username}`);
    };

    return (
        <div className="w-full space-y-6">
            <h2 className="text-center text-3xl font-bold text-background">
                Login
            </h2>

            <form
                onSubmit={onSubmit}
                className="space-y-4"
                aria-label="Login form"
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
                        className="w-full py-3 px-5 rounded-full text-sm font-medium bg-accent text-accent-foreground placeholder:text-accent-foreground/70 border-0 focus:outline-none focus:ring-2 focus:ring-ring"
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
                        className="w-full py-3 px-5 pr-12 rounded-full text-sm font-medium bg-accent text-accent-foreground placeholder:text-accent-foreground/70 border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                        autoComplete="current-password"
                        aria-invalid={!!errors}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-foreground hover:text-accent-foreground/80 transition-colors"
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
                        className="w-full py-3 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
                    >
                        Login
                    </button>
                </div>

                <div className="text-center text-sm text-secondary-foreground/80 pt-1">
                    Don't have an account?{" "}
                    <Link
                        href="/auth/register"
                        className="underline font-medium hover:text-background transition-colors"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
}
