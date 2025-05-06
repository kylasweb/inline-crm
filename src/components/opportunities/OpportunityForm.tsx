import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button
} from '@/components/ui/';
import { DatePicker } from '@/components/ui/date-picker';
import { CreateOpportunityDTO, OpportunityStage } from '@/services/opportunity/opportunityTypes';

const opportunitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  source: z.object({
    type: z.enum(['lead', 'direct', 'referral']),
    id: z.string().optional(),
  }),
  accountId: z.string().min(1, 'Account is required'),
  value: z.object({
    amount: z.number().min(0, 'Value must be positive'),
    currency: z.string().default('USD'),
    recurringValue: z.number().optional(),
    recurringPeriod: z.enum(['monthly', 'yearly']).optional(),
  }),
  expectedCloseDate: z.string(),
  products: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    discount: z.object({
      type: z.enum(['percentage', 'amount']),
      value: z.number()
    }).optional()
  })).default([]),
  assignedTo: z.string().min(1, 'Owner is required'),
  priority: z.enum(['low', 'medium', 'high']),
  metadata: z.record(z.unknown()).optional()
});

interface OpportunityFormProps {
  initialData?: Partial<CreateOpportunityDTO>;
  onSubmit: (data: CreateOpportunityDTO) => void;
  isLoading?: boolean;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<CreateOpportunityDTO>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      source: initialData?.source || { type: 'direct' },
      accountId: initialData?.accountId || '',
      value: initialData?.value || { amount: 0, currency: 'USD' },
      expectedCloseDate: initialData?.expectedCloseDate || new Date().toISOString(),
      products: initialData?.products || [],
      assignedTo: initialData?.assignedTo || '',
      priority: initialData?.priority || 'medium',
      metadata: initialData?.metadata || {}
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opportunity Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter opportunity name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter opportunity description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="source.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Select account" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="value.amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    placeholder="Enter value amount"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value.currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="expectedCloseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Close Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value ? new Date(field.value) : new Date()}
                  setDate={(date) => field.onChange(date?.toISOString() || new Date().toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Select owner" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Opportunity'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OpportunityForm;