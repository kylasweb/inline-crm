import React, { useState } from 'react';
import { FormDefinition, FormField, FormValues, FormErrors } from './types';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

interface FormPreviewProps {
  definition: FormDefinition;
  onSubmit: (values: FormValues) => void;
  initialValues?: FormValues;
}

function FormPreview({ definition, onSubmit, initialValues = {} }: FormPreviewProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentSection, setCurrentSection] = useState(0);

  const validateField = (field: FormField, value: any): string[] => {
    const fieldErrors: string[] = [];

    if (field.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(`${field.label} is required`);
    }

    if (field.validation) {
      field.validation.forEach(rule => {
        switch (rule.type) {
          case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'phone':
            if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'min':
            if (typeof value === 'number' && value < rule.value) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'max':
            if (typeof value === 'number' && value > rule.value) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'pattern':
            if (value && !new RegExp(rule.value).test(value)) {
              fieldErrors.push(rule.message);
            }
            break;
        }
      });
    }

    return fieldErrors;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedValues = { ...values, [fieldId]: value };
    setValues(updatedValues);

    // Find field definition
    const field = definition.sections.flatMap(s => s.fields).find(f => f.id === fieldId);
    if (field) {
      const fieldErrors = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: fieldErrors
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    let hasErrors = false;

    definition.sections.forEach(section => {
      section.fields.forEach(field => {
        const fieldErrors = validateField(field, values[field.id]);
        if (fieldErrors.length > 0) {
          newErrors[field.id] = fieldErrors;
          hasErrors = true;
        }
      });
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onSubmit(values);
    }
  };

  const renderField = (field: FormField) => {
    const fieldErrors = errors[field.id] || [];

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={values[field.id] || ''}
              onChange={e => handleFieldChange(field.id, e.target.value)}
            />
            {fieldErrors.map((error, i) => (
              <p key={i} className="text-sm text-red-500">{error}</p>
            ))}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              value={values[field.id] || ''}
              onValueChange={value => handleFieldChange(field.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {field.options?.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldErrors.map((error, i) => (
              <p key={i} className="text-sm text-red-500">{error}</p>
            ))}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.id] || ''}
              onChange={e => handleFieldChange(field.id, e.target.value)}
            />
            {fieldErrors.map((error, i) => (
              <p key={i} className="text-sm text-red-500">{error}</p>
            ))}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {definition.layout === 'wizard' ? (
        <Card className="p-6">
          <div className="space-y-6">
            {definition.sections[currentSection].fields.map(renderField)}
            <div className="flex justify-between">
              {currentSection > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentSection(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              {currentSection < definition.sections.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentSection(prev => prev + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        definition.sections.map(section => (
          <Card key={section.id} className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-gray-500">{section.description}</p>
                )}
              </div>
              {section.fields.map(renderField)}
            </div>
          </Card>
        ))
      )}

      {definition.layout !== 'wizard' && (
        <Button type="submit">Submit</Button>
      )}
    </form>
  );
}

export default FormPreview;