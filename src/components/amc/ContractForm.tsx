import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { AMCContract, ContractStatus, PaymentTerms, RenewalStatus } from "@/services/amc/amcTypes"
import { AMCService } from "@/services/amc/amcService"

export enum LicenseType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

const amcService = new AMCService()

const contractFormSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(ContractStatus),
  totalValue: z.number().min(0),
  description: z.string(),
  terms: z.array(z.string()).default([]),
  paymentTerms: z.object({
    duration: z.number().min(1),
    amount: z.number().min(0),
    frequency: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
    lateFeePercentage: z.number().min(0),
    gracePeriod: z.number().min(0)
  }).refine((data) => {
    return data.duration > 0 && 
           data.amount >= 0 && 
           data.lateFeePercentage >= 0 && 
           data.gracePeriod >= 0
  }, "All payment terms must be valid")
})

type ContractFormData = z.infer<typeof contractFormSchema>

interface ContractFormProps {
  contract?: AMCContract
  onSubmit: (contract: AMCContract) => void
  onCancel: () => void
}

export function ContractForm({ contract, onSubmit, onCancel }: ContractFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<ContractFormData> = contract ? {
    customerId: contract.customerId,
    startDate: new Date(contract.startDate),
    endDate: new Date(contract.endDate),
    status: contract.status,
    totalValue: contract.totalValue,
    description: contract.description,
    terms: contract.terms,
    paymentTerms: contract.paymentTerms
  } : {
    status: ContractStatus.ACTIVE,
    terms: [],
    paymentTerms: {
      duration: 12,
      amount: 0,
      frequency: 'MONTHLY',
      lateFeePercentage: 2,
      gracePeriod: 15
    }
  }

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues
  })

  const handleSubmit = async (data: ContractFormData) => {
    try {
      setIsSubmitting(true)
      let result: AMCContract

      if (contract) {
        result = await amcService.updateContract(contract.id, {
          customerId: data.customerId,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          totalValue: data.totalValue,
          description: data.description,
          terms: data.terms,
          paymentTerms: data.paymentTerms as PaymentTerms,
          updatedAt: new Date()
        })
      } else {
        // Omit id, createdAt, updatedAt as they're handled by backend
        const newContract: Omit<AMCContract, 'id' | 'createdAt' | 'updatedAt'> = {
          customerId: data.customerId,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          renewalStatus: RenewalStatus.NOT_DUE,
          totalValue: data.totalValue,
          description: data.description,
          terms: data.terms,
          paymentTerms: data.paymentTerms as PaymentTerms,
          license: {
            id: '',
            type: LicenseType.BASIC,
            key: '',
            issuedDate: new Date(),
            expiryDate: data.endDate,
            maxUsers: 1,
            features: [],
            isActive: true
          }
        }
        result = await amcService.createContract(newContract)
      }

      onSubmit(result)
    } catch (error) {
      console.error("Error submitting contract:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ContractStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Value</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentTerms.frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentTerms.amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentTerms.duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (months)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (contract ? "Update" : "Create")}
          </Button>
        </div>
      </form>
    </Form>
  )
}