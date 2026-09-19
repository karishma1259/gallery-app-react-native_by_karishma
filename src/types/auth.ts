export type Gender = 'Male' | 'Female' | 'Other';

export interface User {
  fullName: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
  password: string; // stored locally only, never displayed
}

export interface PublicUser {
  fullName: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
}

export interface RegisterFormValues {
  fullName: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  fullName?: string;
  email?: string;
  gender?: string;
  mobile?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  form?: string; // e.g. "Invalid credentials"
}
