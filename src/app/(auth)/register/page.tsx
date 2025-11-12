"use client";
import { OnBoardingNamePage, SignUpPage, Testimonial } from "@/components/ui/sign-up";
import { NameFormData, RegisterFormData } from "@/interfaces/clientAuth";
import { getPasswordStrength } from "@/lib/utils/passwordStrength";
import {
    validateConfirmPassword,
    validateEmail,
    validateFirstName,
    validateLastName,
    validatePassword,
} from "@/lib/validators/clientAuth.validator";
import "@/styles/authPages.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const sampleTestimonials: Testimonial[] = [
    {
        avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
        name: "Sarah Chen",
        handle: "@sarahdigital",
        text: "Amazing platform! The user experience is seamless and the features are exactly what I needed.",
    },
];

const RegisterPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [fullName, setFullName] = useState({
        first: "",
        last: "",
    });

    const [user, setUser] = useState({});

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [showSignUpPage , setShowSignUpPage] = useState(true)
    const [showOnBoardingNamePage , setShowOnBoardingNamePage] = useState(false)

     useEffect(() => {
      if (submitSuccess) {
        const timer1 = setTimeout(() => {
            setShowSignUpPage(false)
        }, 915);

        const timer2 = setTimeout(() => {
            setShowOnBoardingNamePage(true)
        }, 1000);
      
    
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
    }, [submitSuccess])

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        console.log(
            validateField(field, formData[field] || fullName[field]),
            errors
        );
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
            case "confirmPassword":
                error = validateConfirmPassword(formData.password, value);
                break;
            case "first":
                error = validateFirstName(value);
                break;
            case "last":
                error = validateLastName(value);
                break;
            default:
                break;
        }
        setErrors({ ...errors, [field]: error });
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const field = e.target.name;

        if (field === "first" || field === "last") {
            setFullName({ ...fullName, [name]: value });
            console.log(fullName);
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (touched[name]) {
            console.log(validateField(name, value));
        }
    };

    useEffect(() => {
        if (touched["confirmPassword"] && formData.confirmPassword) {
            validateField("confirmPassword", formData.confirmPassword);
        }
    }, [formData.password]);

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitSuccess(false);

        const form = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(form.entries());
        const inputData: RegisterFormData = {
            email: formEntries.email as string,
            password: formEntries.password as string,
            confirmPassword: formEntries.confirmPassword as string,
        };

        const emailError = validateEmail(inputData.email);
        const passwordError = validatePassword(inputData.password);
        const confirmPasswordError = validateConfirmPassword(
            inputData.password,
            inputData.confirmPassword
        );

        const newErrors = {
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
        };

        setErrors(newErrors);
        setTouched({ email: true, password: true, confirmPassword: true });

        if (!emailError && !passwordError) {
            setSubmitSuccess(true)
            setFormData(inputData);
            setErrors({});
        }
    };

    const handleNameInput = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(form.entries());
        const inputData: NameFormData = {
            first: formEntries.first as string,
            last: formEntries.last as string,
        };

        const firstNameError = validateFirstName(inputData.first);
        const lastNameError = validateLastName(inputData.last);

        const newErrors = {
            first: firstNameError,
            last: lastNameError,
        };
        setErrors(newErrors);
        setTouched({ first: true, last: true });


        if (!firstNameError && !lastNameError) {
            setFullName(inputData);

            if (formData && fullName) {
                const completeUserCreds = {
                    firstName: fullName.first,
                    lastName: fullName.last,
                    ...formData,
                };
                setUser(completeUserCreds);
                console.log(completeUserCreds)
            }

            axios
                .post("/api/auth/register", user)
                .then((response) => {
                    setIsSubmitting(true);
                    console.log(response);
                    if (response.status === 201) router.push("/dashboard/home");
                })
                .catch((error) => {
                    console.log("Error in register :",error);
                    console.log("Sended to axios :", user);
                });
        }
    };

    const handleGoogleSignUp = () => {
        console.log("Continue with Google clicked");
        alert("Continue with Google clicked");
    };

    const handleResetPassword = () => {
        alert("Reset Password clicked");
    };

    const handleLogInAccount = () => {
        router.push("/login");
    };
    

    return (
        <div className="text-foreground">
          {showSignUpPage &&  <SignUpPage
                heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                testimonials={sampleTestimonials}
                onSignUp={handleSignUp}
                onGoogleSignUp={handleGoogleSignUp}
                onResetPassword={handleResetPassword}
                onLogInAccount={handleLogInAccount}
                onBlur={handleBlur}
                onChange={handleChange}
                errors={errors}
                touched={touched}
                passwordStrength={passwordStrength}
                toggle={submitSuccess}
            />}
            {showOnBoardingNamePage && <OnBoardingNamePage
                title={"Tell us who you Are?"}
                toggle={submitSuccess}
                 onBlur={handleBlur}
                  onChange={handleChange}
                errors={errors}
                touched={touched}
                onNameInput={handleNameInput}
            />}

        </div>
    );
};

export default RegisterPage;
