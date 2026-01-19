/**
 * Validation Utilities
 *
 * Common validation functions for forms and data
 */

/**
 * Validate Nigerian phone number
 * Supports formats: 08012345678, +2348012345678, 2348012345678
 *
 * @param phone - Phone number to validate
 * @returns True if valid Nigerian phone number
 */
export const isValidNigerianPhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Check for valid Nigerian phone formats
  // 11 digits starting with 0: 08012345678
  // 13 digits starting with 234: 2348012345678
  const patterns = [
    /^0[7-9][0-1]\d{8}$/, // 08012345678
    /^234[7-9][0-1]\d{8}$/, // 2348012345678
  ];

  return patterns.some((pattern) => pattern.test(cleaned));
};

/**
 * Normalize Nigerian phone number to standard format (08012345678)
 *
 * @param phone - Phone number to normalize
 * @returns Normalized phone number or original if invalid
 */
export const normalizeNigerianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("234")) {
    return "0" + cleaned.substring(3);
  }

  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return cleaned;
  }

  if (cleaned.length === 10) {
    return "0" + cleaned;
  }

  return phone; // Return original if can't normalize
};

/**
 * Format Nigerian phone number for display (+234 801 234 5678)
 *
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export const formatNigerianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    const international = "234" + cleaned.substring(1);
    return `+${international.substring(0, 3)} ${international.substring(3, 6)} ${international.substring(6, 9)} ${international.substring(9)}`;
  }

  if (cleaned.startsWith("234")) {
    return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
  }

  return phone;
};

/**
 * Validate email address
 *
 * @param email - Email to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 *
 * @param password - Password to validate
 * @returns Object with validation result and strength score
 */
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  errors: string[];
} => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  } else {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letter");
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letter");
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push("Password must contain number");
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain special character");
  } else {
    score += 1;
  }

  // Determine strength
  let strength: "weak" | "medium" | "strong" = "weak";
  if (score >= 5) {
    strength = "strong";
  } else if (score >= 3) {
    strength = "medium";
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

/**
 * Validate BVN (Bank Verification Number)
 * BVN is 11 digits
 *
 * @param bvn - BVN to validate
 * @returns True if valid BVN
 */
export const isValidBVN = (bvn: string): boolean => {
  const cleaned = bvn.replace(/\D/g, "");
  return cleaned.length === 11;
};

/**
 * Mask BVN for display (show only last 4 digits)
 *
 * @param bvn - BVN to mask
 * @returns Masked BVN (e.g., "*******8901")
 */
export const maskBVN = (bvn: string): string => {
  if (bvn.length < 4) return bvn;
  return "*".repeat(bvn.length - 4) + bvn.slice(-4);
};

/**
 * Validate Nigerian account number
 * Account number is usually 10 digits
 *
 * @param accountNumber - Account number to validate
 * @returns True if valid account number
 */
export const isValidAccountNumber = (accountNumber: string): boolean => {
  const cleaned = accountNumber.replace(/\D/g, "");
  return cleaned.length === 10;
};

/**
 * Validate NIN (National Identification Number)
 * NIN is 11 digits
 *
 * @param nin - NIN to validate
 * @returns True if valid NIN
 */
export const isValidNIN = (nin: string): boolean => {
  const cleaned = nin.replace(/\D/g, "");
  return cleaned.length === 11;
};
