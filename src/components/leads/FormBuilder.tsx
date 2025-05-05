import React, { useState } from 'react';
import { FormDefinition, FormSection, FormField } from './types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export interface FormBuilderProps {
  initialDefinition?: FormDefinition;
  onChange: (definition: FormDefinition) => void;
}

export const FormBuilder = ({
  initialDefinition,
  onChange
}: FormBuilderProps) => {
  // ... rest of the component implementation remains the same ...
  const [formDefinition, setFormDefinition] = useState<FormDefinition>(
    initialDefinition || {
      id: crypto.randomUUID(),
      name: 'New Form',
      sections: [],
      layout: 'single',
      theme: { variant: 'default' },
      validationRules: []
    }
  );

  const addSection = () => {
    const newSection: FormSection = {
      id: crypto.randomUUID(),
      title: `Section ${formDefinition.sections.length + 1}`,
      fields: []
    };

    const updatedDefinition = {
      ...formDefinition,
      sections: [...formDefinition.sections, newSection]
    };

    setFormDefinition(updatedDefinition);
    onChange(updatedDefinition);
  };

  const addField = (sectionId: string) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type: 'text',
      label: `Field ${formDefinition.sections.find(s => s.id === sectionId)?.fields.length || 0 + 1}`,
      required: false,
      validation: []
    };

    const updatedDefinition = {
      ...formDefinition,
      sections: formDefinition.sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, newField] }
          : section
      )
    };

    setFormDefinition(updatedDefinition);
    onChange(updatedDefinition);
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    const updatedDefinition = {
      ...formDefinition,
      sections: formDefinition.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              )
            }
          : section
      )
    };

    setFormDefinition(updatedDefinition);
    onChange(updatedDefinition);
  };

  const updateSection = (sectionId: string, updates: Partial<FormSection>) => {
    const updatedDefinition = {
      ...formDefinition,
      sections: formDefinition.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    };

    setFormDefinition(updatedDefinition);
    onChange(updatedDefinition);
  };

  const removeField = (sectionId: string, fieldId: string) => {
    const updatedDefinition = {
      ...formDefinition,
      sections: formDefinition.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter(field => field.id !== fieldId)
            }
          : section
      )
    };

    setFormDefinition(updatedDefinition);
    onChange(updatedDefinition);
  };

  const removeSection = (sectionId: string) => {
    const updatedDefinition = {
      ...formDefinition,
      sections: formDefinition.sections.filter(section => section.id !== sectionId)
    };

    setFormDefinition(updatedDefinition);
    onChange(updatedDefinition);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <Input
            placeholder="Form Name"
            value={formDefinition.name}
            onChange={e => {
              const updatedDefinition = {
                ...formDefinition,
                name: e.target.value
              };
              setFormDefinition(updatedDefinition);
              onChange(updatedDefinition);
            }}
          />

          <Select
            value={formDefinition.layout}
            onValueChange={value => {
              const updatedDefinition = {
                ...formDefinition,
                layout: value as FormDefinition['layout']
              };
              setFormDefinition(updatedDefinition);
              onChange(updatedDefinition);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="single">Single Page</SelectItem>
                <SelectItem value="multi">Multi Page</SelectItem>
                <SelectItem value="wizard">Wizard</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={formDefinition.theme.variant}
            onValueChange={value => {
              const updatedDefinition = {
                ...formDefinition,
                theme: { ...formDefinition.theme, variant: value as FormDefinition['theme']['variant'] }
              };
              setFormDefinition(updatedDefinition);
              onChange(updatedDefinition);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Accordion type="single" collapsible>
        {formDefinition.sections.map((section, index) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <span>{section.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(section.id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={e => updateSection(section.id, { title: e.target.value })}
                />

                <Input
                  placeholder="Description"
                  value={section.description || ''}
                  onChange={e => updateSection(section.id, { description: e.target.value })}
                />

                {section.fields.map(field => (
                  <Card key={field.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">{field.label}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(section.id, field.id)}
                        >
                          Remove
                        </Button>
                      </div>

                      <Input
                        placeholder="Field Label"
                        value={field.label}
                        onChange={e =>
                          updateField(section.id, field.id, { label: e.target.value })
                        }
                      />

                      <Select
                        value={field.type}
                        onValueChange={value =>
                          updateField(section.id, field.id, {
                            type: value as FormField['type']
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Field Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={checked =>
                            updateField(section.id, field.id, { required: checked })
                          }
                        />
                        <span className="text-sm">Required</span>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  onClick={() => addField(section.id)}
                >
                  Add Field
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button onClick={addSection}>Add Section</Button>
    </div>
  );
};

export { FormBuilder as default };