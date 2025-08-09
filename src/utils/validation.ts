import { ValidationRule, ValidationError } from '../types/form';

export const validateField = (value: any, rules: ValidationRule[], fieldLabel: string): string | null => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return `${fieldLabel} is required`;
        }
        break;
        
      case 'minLength':
        if (typeof value === 'string' && value.length < rule.value) {
          return `${fieldLabel} must be at least ${rule.value} characters long`;
        }
        break;
        
      case 'maxLength':
        if (typeof value === 'string' && value.length > rule.value) {
          return `${fieldLabel} must be no more than ${rule.value} characters long`;
        }
        break;
        
      case 'email':
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return `${fieldLabel} must be a valid email address`;
          }
        }
        break;
        
      case 'password':
        if (typeof value === 'string') {
          if (value.length < 8) {
            return `${fieldLabel} must be at least 8 characters long`;
          }
          if (!/\d/.test(value)) {
            return `${fieldLabel} must contain at least one number`;
          }
        }
        break;
    }
  }
  return null;
};

export const validateForm = (formData: Record<string, any>, fields: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  fields.forEach(field => {
    if (!field.derivedConfig?.isDerived) {
      const value = formData[field.id];
      const error = validateField(value, field.validationRules, field.label);
      if (error) {
        errors.push({ fieldId: field.id, message: error });
      }
    }
  });
  
  return errors;
};