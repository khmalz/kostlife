import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";

export default function LoginPage() {
    return (
        <Suspense fallback={<AuthFormSkeleton type="login" />}>
            <LoginForm />
        </Suspense>
    );
}
