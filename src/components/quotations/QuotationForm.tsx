import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { CreateQuotationDTO, QuotationItem, Tax } from '@/services/quotation/quotationTypes';

const quotationSchema = z.object({
  opportunityId: z.string().min(1, 'Opportunity is required'),
  accountId: z.string().min(1, 'Account is required'),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be non-negative'),
    discount: z.number().min(0).max(100).optional(),
    total: z.number()
  })).min(1, 'At least one item is required'),
  taxes: z.array(z.object({
    name: z.string().min(1, 'Tax name is required'),
    rate: z.number().min(0).max(100),
  })).optional(),
  validUntil: z.date().min(new Date(), 'Valid until date must be in the future'),
});

interface QuotationFormProps {
  initialData?: Partial<CreateQuotationDTO>;
  onSubmit: (data: CreateQuotationDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function QuotationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: QuotationFormProps) {
  const form = useForm<CreateQuotationDTO>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      items: [{ productId: '', name: '', quantity: 1, unitPrice: 0, total: 0 }],
      taxes: [{ name: 'VAT', rate: 18 }],
      ...initialData
    }
  });

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const items = form.watch('items');
  const taxes = form.watch('taxes');

  useEffect(() => {
    // Calculate subtotal
    const newSubtotal = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal - (itemTotal * (item.discount || 0) / 100));
    }, 0);
    setSubtotal(newSubtotal);

    // Calculate total with taxes
    const taxAmount = (taxes || []).reduce((sum, tax) => {
      return sum + (newSubtotal * tax.rate / 100);
    }, 0);
    setTotal(newSubtotal + taxAmount);
  }, [items, taxes]);

  const addItem = () => {
    const currentItems = form.getValues('items');
    const newItem = {
      productId: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0 // Add total field with initial value
    };
    form.setValue('items', [...currentItems, newItem]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    form.setValue('items', currentItems.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Account and Opportunity Selection */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Account options will be populated from the API */}
                    <SelectItem value="1">Sample Account</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opportunityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opportunity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select opportunity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Opportunity options will be populated from the API */}
                    <SelectItem value="1">Sample Opportunity</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Items */}
        <div className="space-y-4">
          <Label>Items</Label>
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-12 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.discount`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Discount %</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addItem}>
            Add Item
          </Button>
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {taxes?.map((tax, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{tax.name} ({tax.rate}%):</span>
              <span>${(subtotal * tax.rate / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Quotation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default QuotationForm;