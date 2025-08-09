export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export type ValidationRule = 
  | { type: 'required' }
  | { type: 'minLength'; value: number }
  | { type: 'maxLength'; value: number }
  | { type: 'email' }
  | { type: 'password' };

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedFieldConfig {
  isDerived: boolean;
  parentFields: string[];
  computationType: 'age' | 'sum' | 'concat' | 'custom';
  customLogic?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  validationRules: ValidationRule[];
  options?: SelectOption[]; // for select/radio fields
  derivedConfig?: DerivedFieldConfig;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  [fieldId: string]: any;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}