import React, { useState } from "react";
import {
    AlertCircle,
    ArrowBigRightDash,
    ArrowDownRightIcon,
    Eye,
    EyeOff,
} from "lucide-react";
import Image from "next/image";
import { easeInOut, motion } from "motion/react";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 48 48"
    >
        <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
        />
        <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
        />
    </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
    avatarSrc: string;
    name: string;
    handle: string;
    text: string;
}

interface SignUpPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroImageSrc?: string;
    testimonials?: Testimonial[];
    onNameInput?: (event: React.FormEvent<HTMLFormElement>) => void;
    onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGoogleSignUp?: () => void;
    onResetPassword?: () => void;
    onLogInAccount?: () => void;
    onBlur?: (field: string) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors?: { [key: string]: string };
    touched?: { [key: string]: boolean };
    passwordStrength?: { strength: number; label: string; color: string };
    toggle?: boolean;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl w-full border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
        {children}
    </div>
);

const TestimonialCard = ({
    testimonial,
    delay,
}: {
    testimonial: Testimonial;
    delay: string;
}) => (
    <div
        className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}
    >
        <Image
            width={40}
            height={40}
            src={testimonial.avatarSrc}
            className="h-10 w-10 object-cover rounded-xl"
            alt="avatar"
        />
        <div className="text-sm leading-snug">
            <p className="flex items-center gap-1 font-medium">
                {testimonial.name}
            </p>
            <p className="text-muted-foreground">{testimonial.handle}</p>
            <p className="mt-1 text-foreground/80">{testimonial.text}</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const SignUpPage: React.FC<SignUpPageProps> = ({
    title = (
        <span className="font-medium text-foreground tracking-tighter">
            Welcome to Monexa
        </span>
    ),
    heroImageSrc,
    onSignUp,
    onGoogleSignUp,
    onResetPassword,
    onLogInAccount,
    onBlur,
    onChange,
    errors,
    touched,
    toggle,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row w-[100dvw] overflow-hidden">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-2 w-full ">
                        <h1 className={`${toggle ? 'animate-element-backwards animate-delay-900':'animate-element animate-delay-100'}    relative mx-auto  text-4xl md:text-3xl font-semibold leading-tight`}>
                            {title}
                        </h1>
                        {/* <p className="animate-element animate-delay-200 text-muted-foreground">
                            {description}
                        </p> */}

                        <form className="space-y-3 " onSubmit={onSignUp}>
                            <div className={`${toggle ? 'animate-element-backwards animate-delay-700':'animate-element animate-delay-300'}`}>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email Address
                                </label>
                                <GlassInputWrapper>
                                    <input
                                        name="email"
                                        onChange={onChange}
                                        onBlur={() => onBlur("email")}
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full bg-transparent text-[0.85rem] leading-0.5 p-4 rounded-2xl focus:outline-none"
                                    />
                                </GlassInputWrapper>
                                {errors.email && touched.email && (
                                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className={`${toggle ? 'animate-element-backwards animate-delay-600':'animate-element animate-delay-400'}`}>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Password
                                </label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            onChange={onChange}
                                            onBlur={() => onBlur("password")}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            className="w-full bg-transparent text-[0.85rem] leading-0.5 p-4 pr-12 rounded-2xl focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                                {errors.password && touched.password && (
                                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.password}</span>
                                    </div>
                                )}
                            </div>

                            <div className={`${toggle ? 'animate-element-backwards animate-delay-600':'animate-element animate-delay-400'}`}>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Confirm Password
                                </label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input
                                            name="confirmPassword"
                                            onChange={onChange}
                                            onBlur={() =>
                                                onBlur("confirmPassword")
                                            }
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            className="w-full bg-transparent text-[0.85rem] leading-0.5 p-4 pr-12 rounded-2xl focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                                {errors.confirmPassword &&
                                    touched.confirmPassword && (
                                        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>
                                                {errors.confirmPassword}
                                            </span>
                                        </div>
                                    )}
                            </div>

                            <div className={`${toggle ? 'animate-element-backwards animate-delay-500':'animate-element animate-delay-500'} flex items-center justify-between text-sm`}>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        className="custom-checkbox"
                                    />
                                    <span className="text-foreground/90">
                                        Keep me signed in
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onResetPassword?.();
                                    }}
                                    className="hover:underline text-violet-400 transition-colors"
                                >
                                    Reset password
                                </a>
                            </div>

                            <button
                                type="submit"
                                className={`${toggle ? 'animate-element-backwards animate-delay-400':'animate-element animate-delay-600'} w-full flex justify-center items-center gap-2 rounded-2xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors`}
                            >
                                Continue{" "}
                                <ArrowDownRightIcon></ArrowDownRightIcon>
                            </button>
                        </form>

                        <div className={`${toggle ? 'animate-element-backwards animate-delay-300':'animate-element animate-delay-700'} relative flex items-center justify-center my-1`}>
                            <span className="w-full border-t border-border"></span>
                            <span className="px-4 text-sm text-muted-foreground bg-black absolute">
                                Or
                            </span>
                        </div>

                        <button
                            onClick={onGoogleSignUp}
                            className={`${toggle ? 'animate-element-backwards animate-delay-200':'animate-element animate-delay-800'} w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-3 hover:bg-violet-950 transition-colors`}
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        <p className={`${toggle ? 'animate-element-backwards animate-delay-100':'animate-element animate-delay-900'} text-center text-sm text-muted-foreground`}>
                            Already Registered?{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onLogInAccount?.();
                                }}
                                className="text-violet-400 hover:underline transition-colors"
                            >
                                Log In
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image + testimonials */}
            {heroImageSrc && (
                <section className="hidden md:block flex-1 relative p-4">
                    <div
                        className={`absolute z-10 inset-4 rounded-3xl bg-cover bg-center ${toggle ? 'animate-element-backwards animate-delay-700':'animate-slide-right animate-delay-300 '}`}
                        style={{ backgroundImage: `url(${heroImageSrc})` }}
                    ></div>

                </section>
            )}
        </div>
    );
};

export const OnBoardingNamePage = ({title,toggle,onNameInput,onChange,onBlur,errors,touched}) => { 

    return (
        <div className={`${toggle ? 'block' : 'hidden'} absolute z-[999] top-0 left-0 h-screen w-full overflow-hidden`}>
            <section className="flex flex-col items-center justify-center h-full w-full border gap-5">
                <h1 className={`${!toggle ? 'animate-element-backwards animate-delay-900':'animate-element animate-delay-100'}    relative mx-auto  text-4xl md:text-3xl font-semibold leading-tight`}>
                            {title}
                        </h1>
                 <form className="space-y-6 relative lg:w-[30%] w-[50%]" onSubmit={onNameInput}>
                            <div className={`${!toggle ? 'animate-element-backwards animate-delay-700':'animate-element animate-delay-300'}`}>
                                <label className="text-sm font-medium text-muted-foreground">
                                    First Name
                                </label>
                                <GlassInputWrapper>
                                    <input
                                        name="first"
                                        onChange={onChange}
                                        onBlur={() => onBlur("first")}
                                        type="first"
                                        placeholder="Enter your first name"
                                        className="w-full bg-transparent text-[0.85rem] leading-0.5 p-4 rounded-lg focus:outline-none"
                                    />
                                </GlassInputWrapper>
                                {errors.first && touched.first && (
                                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.first}</span>
                                    </div>
                                )}
                            </div>
                            <div className={`${!toggle ? 'animate-element-backwards animate-delay-700':'animate-element animate-delay-300'}`}>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Last Name
                                </label>
                                <GlassInputWrapper>
                                    <input
                                        name="last"
                                        onChange={onChange}
                                        onBlur={() => onBlur("last")}
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="w-full bg-transparent text-[0.85rem] leading-0.5 p-4 rounded-lg focus:outline-none"
                                    />
                                </GlassInputWrapper>
                                {errors.last && touched.last && (
                                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.last}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={`${!toggle ? 'animate-element-backwards animate-delay-400':'animate-element animate-delay-600'} w-full flex justify-center items-center gap-2 rounded-2xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors`}
                            >
                                Sign Up{" "}
                                <ArrowDownRightIcon></ArrowDownRightIcon>
                            </button>
                        </form>
            </section>
        </div>
    )
 }
