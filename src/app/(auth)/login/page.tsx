"use client";
import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { useAuth } from "@/context/AuthProvider";
import { LogInFormData } from "@/interfaces/clientAuth";
import { getPasswordStrength } from "@/lib/utils/passwordStrength";
import {
    validateEmail,
    validatePassword,
} from "@/lib/validators/clientAuth.validator";
import "@/styles/authPages.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const sampleTestimonials: Testimonial[] = [
    {
        avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
        name: "Sarah Chen",
        handle: "@sarahdigital",
        text: "Amazing platform! The user experience is seamless and the features are exactly what I needed.",
    },
];

const LogInPage = () => {
    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [user, setUser] = useState({});

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        validateField(field, formData[field]);
    };

    const validateField = (field: string, value: string) => {
        let error = "";
        switch (field) {
            case "email":
                error = validateEmail(value);
                break;
            case "password":
                error = validatePassword(value);
                break;
            default:
                break;
        }
        setErrors({ ...errors, [field]: error });
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitSuccess(false);

        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData.entries());
        const inputData: LogInFormData = {
            email: formEntries.email as string,
            password: formEntries.password as string,
        };
        setFormData(inputData);

        const emailError = validateEmail(inputData.email);
        const passwordError = validatePassword(inputData.password);

        const newErrors = {
            email: emailError,
            password: passwordError,
        };

        setErrors(newErrors);
        setTouched({ email: true, password: true });

        if (!emailError && !passwordError) {
            try {
                setIsSubmitting(true);

                const response = await axios.post("/api/auth/login", inputData);

                if (response.status === 201) {
                    // optional small delay to ensure cookies set before navigation
                    await new Promise((res) => setTimeout(res, 300));
                    login(); // updates AuthContext
                    setSubmitSuccess(true);
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Login error:", error);
                setSubmitSuccess(false);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleGoogleSignIn = () => {
        console.log("Continue with Google clicked");
        alert("Continue with Google clicked");
    };

    const handleResetPassword = () => {
        alert("Reset Password clicked");
    };

    const handleCreateAccount = () => {
        router.push("/register");
    };

    return (
        <div className=" text-foreground">
            <SignInPage
                heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                testimonials={sampleTestimonials}
                onSignIn={handleSignIn}
                onGoogleSignIn={handleGoogleSignIn}
                onResetPassword={handleResetPassword}
                onCreateAccount={handleCreateAccount}
                onBlur={handleBlur}
                onChange={handleChange}
                passwordStrength={passwordStrength}
                errors={errors}
                touched={touched}
            />
        </div>
    );
};

export default LogInPage;
