import { RegisterErrors, RegisterFormValues, LoginErrors, LoginFormValues } from '@/types/auth';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile.trim());
};

/**
 * Validates the registration form and returns a map of field -> error message.
 * An empty object means the form is valid.
 */
export const validateRegisterForm = (values: RegisterFormValues): RegisterErrors => {
  const errors: RegisterErrors = {};

  if (!values.fullName.trim()) errors.fullName = 'Full name is required';

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.gender) errors.gender = 'Please select a gender';

  if (!values.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!validateMobile(values.mobile)) {
    errors.mobile = 'Mobile number must be exactly 10 digits';
  }

  if (!values.address.trim()) errors.address = 'Address is required';
  if (!values.city.trim()) errors.city = 'Please select a city';

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = (values: LoginFormValues): LoginErrors => {
  const errors: LoginErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const isFormValid = (errors: object): boolean =>
  Object.values(errors as Record<string, string | undefined>).every((v) => !v);