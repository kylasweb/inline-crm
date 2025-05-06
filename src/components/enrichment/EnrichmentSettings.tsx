import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ValidationRule } from '@/services/enrichment/enrichmentTypes';

interface FormValues {
  autoEnrich: boolean;
  enrichmentFrequency: number;
  requiredFields: string[];
  minimumConfidence: number;
  validationRules: ValidationRule[];
  cacheDuration: number;
}

export function EnrichmentSettings() {
  const form = useForm<FormValues>({
    defaultValues: {
      autoEnrich: true,
      enrichmentFrequency: 24,
      requiredFields: ['company', 'email'],
      minimumConfidence: 0.7,
      validationRules: [
        {
          field: 'email',
          type: 'format',
          value: 'email',
          message: 'Invalid email format'
        },
        {
          field: 'company',
          type: 'required',
          message: 'Company name is required'
        }
      ],
      cacheDuration: 24
    }
  });

  const handleSave = (values: FormValues) => {
    console.log('Saving settings:', values);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Enrichment Settings</h2>
        <Button onClick={form.handleSubmit(handleSave)}>Save Changes</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="autoEnrich"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Automatic Enrichment</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enrichmentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enrichment Frequency (hours)</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumConfidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Confidence Score</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Cache Settings</h3>
            <FormField
              control={form.control}
              name="cacheDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cache Duration (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Validation Rules</h3>
            <div className="space-y-4">
              {form.watch('validationRules').map((rule, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Select
                    value={rule.field}
                    onValueChange={(value) => {
                      const newRules = [...form.getValues('validationRules')];
                      newRules[index] = { ...rule, field: value };
                      form.setValue('validationRules', newRules);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={rule.type}
                    onValueChange={(value) => {
                      const newRules = [...form.getValues('validationRules')];
                      newRules[index] = { 
                        ...rule, 
                        type: value as 'required' | 'format' | 'range'
                      };
                      form.setValue('validationRules', newRules);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Required</SelectItem>
                      <SelectItem value="format">Format</SelectItem>
                      <SelectItem value="range">Range</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newRules = form.getValues('validationRules')
                        .filter((_, i) => i !== index);
                      form.setValue('validationRules', newRules);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newRule: ValidationRule = {
                    field: 'company',
                    type: 'required',
                    message: 'Field is required'
                  };
                  form.setValue('validationRules', [
                    ...form.getValues('validationRules'),
                    newRule
                  ]);
                }}
              >
                Add Rule
              </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}