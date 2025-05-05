import React, { useState } from 'react';
import { FormBuilder, FormPreview } from './';
import type { FormDefinition, FormValues } from './';
import { leadService } from '../../services/leadService';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from '../ui/use-toast';

export function LeadConfigurator() {
  const [formDefinition, setFormDefinition] = useState<FormDefinition>({
    id: crypto.randomUUID(),
    name: 'New Lead Form',
    sections: [],
    layout: 'single',
    theme: { variant: 'default' },
    validationRules: []
  });

  const [previewData, setPreviewData] = useState<FormValues>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFormDefinitionChange = (definition: FormDefinition) => {
    setFormDefinition(definition);
  };

  const handleFormSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Convert form values to LeadFormData
      const leadData = {
        name: values.name || '',
        company: values.company || '',
        email: values.email || '',
        phone: values.phone || '',
        status: 'New',
        source: 'Web Form',
        notes: values.notes || ''
      };

      // Submit the lead data
      const response = await leadService.createLead(leadData);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Lead has been created successfully.',
        });
        setPreviewData({});
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create lead',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while creating the lead.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      setIsSaving(true);

      if (formDefinition.sections.length === 0) {
        toast({
          title: 'Validation Error',
          description: 'Form must have at least one section with fields.',
          variant: 'destructive',
        });
        return;
      }

      const response = await leadService.createFormConfiguration(formDefinition);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Form configuration has been saved.',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to save form configuration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving the configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6 p-4">
        <h1 className="text-2xl font-bold mb-4">Lead Form Configurator</h1>
        <p className="text-gray-600">
          Design and preview your lead capture form. Configure fields, validation rules,
          and test the form before saving.
        </p>
      </Card>

      <Tabs defaultValue="builder">
        <TabsList className="mb-4">
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="preview">Form Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <Card className="p-6">
            <FormBuilder
              initialDefinition={formDefinition}
              onChange={handleFormDefinitionChange}
            />
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveConfiguration}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="p-6">
            <FormPreview
              definition={formDefinition}
              onSubmit={handleFormSubmit}
              initialValues={previewData}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LeadConfigurator;