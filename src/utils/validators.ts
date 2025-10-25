import { MAX_IMAGE_SIZE } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required' };
  }
  if (title.length > 50) {
    return { isValid: false, error: 'Title must be 50 characters or less' };
  }
  return { isValid: true };
}

export function validateShortDescription(description: string): ValidationResult {
  if (!description || description.trim().length === 0) {
    return { isValid: false, error: 'Short description is required' };
  }
  if (description.length > 150) {
    return { isValid: false, error: 'Short description must be 150 characters or less' };
  }
  return { isValid: true };
}

export function validateFullDescription(description: string): ValidationResult {
  if (!description || description.trim().length === 0) {
    return { isValid: false, error: 'Full description is required' };
  }
  if (description.length < 20) {
    return { isValid: false, error: 'Full description must be at least 20 characters' };
  }
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
}

export function validatePrice(price: number): ValidationResult {
  if (price < 0) {
    return { isValid: false, error: 'Price cannot be negative' };
  }
  if (price > 999999999) {
    return { isValid: false, error: 'Price is too large' };
  }
  return { isValid: true };
}

export function validateImage(file: File): ValidationResult {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > MAX_IMAGE_SIZE) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { isValid: true };
}
