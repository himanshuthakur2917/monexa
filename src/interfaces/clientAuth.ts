export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LogInFormData {
    email: string;
    password: string;
}

export interface NameFormData {
    first: string;
    last: string;
}

export interface ValidateEmail {
    (email: string): string;
}

export interface ValidatePassword {
    (password: string): string;
}

export interface ValidateConfirmPassword {
    (confirmPassword: string, password: string): string;
}

export interface ValidateName {
    (name: string): string;
}

export interface AuthContextType {
    accessToken: string | null;
    login: (token: string) => void;
    logout: () => Promise<void>;
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}
