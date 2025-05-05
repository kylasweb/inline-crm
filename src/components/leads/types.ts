// Form Field Types
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'number' | 'date';
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

// Form Structure Types
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  sections: FormSection[];
  layout: 'single' | 'multi' | 'wizard';
  theme: {
    variant: 'default' | 'compact' | 'featured';
    customColors?: {
      primary?: string;
      secondary?: string;
      background?: string;
    };
  };
  validationRules: ValidationRule[];
}

// Form State Types
export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string[];
}

export interface FormState {
  values: FormValues;
  errors: FormErrors;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

// Component Props Types
export interface LeadFormProps {
  formDefinition: FormDefinition;
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  onValidate?: (values: FormValues) => Promise<FormErrors>;
}

export type { FormBuilderProps } from './FormBuilder';