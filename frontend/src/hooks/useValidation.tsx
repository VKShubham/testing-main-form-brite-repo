import { useState } from "react";

interface FormData {
  practiceName?: string;
  fullName: string;
  phone: string;
  email: string;
  faxNumber?: string;
}

type ValidationRule = {
  required?: boolean;
  message?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
};

type ValidationRules<T> = Partial<Record<keyof T, ValidationRule>>;
type Errors<T> = Partial<Record<keyof T, string>>;

const useValidation = (rules: ValidationRules<FormData>) => {
  const [errors, setErrors] = useState<Errors<FormData>>({});

  const validateFields = (formData: FormData): boolean => {
    let newErrors: Errors<FormData> = {};

    Object.keys(rules).forEach((field) => {
      const rule = rules[field as keyof FormData];
      const value = formData[field as keyof FormData];

      // Required field validation
      if (
        rule?.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        newErrors[field as keyof FormData] =
          rule.message || `${field} is required`;
      }

      // Pattern validation (for emails, phone numbers, etc.)
      if (rule?.pattern && value && !rule.pattern.value.test(value)) {
        newErrors[field as keyof FormData] = rule.pattern.message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const clearError = (fieldName: keyof FormData) => {
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  const setError = (fieldName: keyof FormData, errorMessage: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
  };

  return { errors, validateFields, clearError, setError };
};

export default useValidation;
