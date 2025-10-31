import { ValidateConfirmPassword, ValidateEmail, ValidateName, ValidatePassword } from "@/interfaces/clientAuth";

export const validateEmail:ValidateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

export const validatePassword:ValidatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain a special character (!@#$%^&*)';
    return '';
  };

export const validateConfirmPassword:ValidateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

export const validateFirstName:ValidateName = (name) => {
    if (!name) return 'First name is required';
    if (name.length === 0 && name.length < 3   ) return 'First name must be at least 3 characters';
    if (/[0-9]/.test(name)) return 'First name must not contain a number';
    if (/[!@#$%^&*]/.test(name)) return 'First name must not contain a special character (!@#$%^&*)';
    return '';
  };

export const validateLastName:ValidateName = (name) => {
    if (!name) return 'Last name is required';
    if (name.length === 0 && name.length < 3   ) return 'Last name must be at least 3 characters';
    if (/[0-9]/.test(name)) return 'Last name must not contain a number';
    if (/[!@#$%^&*]/.test(name)) return 'Last name must not contain a special character (!@#$%^&*)';
    return '';
  };
