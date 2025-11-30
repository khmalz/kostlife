import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";

export default function RegisterPage() {
    return (
        <Suspense fallback={<AuthFormSkeleton type="register" />}>
            <RegisterForm />
        </Suspense>
    );
}
