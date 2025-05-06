import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AMCContract, ContractRenewalRequest, LicenseType, RenewalStatus } from "@/services/amc/amcTypes"
import { AMCService } from "@/services/amc/amcService"

const amcService = new AMCService()

const renewalFormSchema = z.object({
  newStartDate: z.date(),
  newEndDate: z.date(),
  updatedLicenseType: z.nativeEnum(LicenseType).optional(),
  paymentAmount: z.number().min(0).optional(),
  paymentFrequency: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).optional()
})

type RenewalFormData = z.infer<typeof renewalFormSchema>

export function RenewalDashboard() {
  const [contracts, setContracts] = useState<AMCContract[]>([])
  const [loading, setLoading] = useState(true)
  const [showRenewalForm, setShowRenewalForm] = useState(false)
  const [selectedContract, setSelectedContract] = useState<AMCContract | null>(null)

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      const data = await amcService.listContracts()
      setContracts(data)
    } catch (error) {
      console.error("Error loading contracts:", error)
    } finally {
      setLoading(false)
    }
  }

  const form = useForm<RenewalFormData>({
    resolver: zodResolver(renewalFormSchema),
    defaultValues: {
      newStartDate: new Date(),
      newEndDate: new Date(),
    }
  })

  const handleRenewal = async (data: RenewalFormData) => {
    if (!selectedContract) return

    try {
      const renewalRequest: ContractRenewalRequest = {
        contractId: selectedContract.id,
        newStartDate: data.newStartDate,
        newEndDate: data.newEndDate,
        updatedLicenseType: data.updatedLicenseType,
        updatedPaymentTerms: data.paymentAmount && data.paymentFrequency ? {
          amount: data.paymentAmount,
          frequency: data.paymentFrequency,
          duration: Math.ceil(
            (data.newEndDate.getTime() - data.newStartDate.getTime()) / 
            (1000 * 60 * 60 * 24 * 30)
          ),
          lateFeePercentage: selectedContract.paymentTerms.lateFeePercentage,
          gracePeriod: selectedContract.paymentTerms.gracePeriod
        } : undefined
      }

      await amcService.renewContract(renewalRequest)
      await loadContracts()
      setShowRenewalForm(false)
      setSelectedContract(null)
    } catch (error) {
      console.error("Error processing renewal:", error)
    }
  }

  const getRenewalStatusColor = (status: RenewalStatus) => {
    switch (status) {
      case RenewalStatus.NOT_DUE:
        return "bg-green-500"
      case RenewalStatus.DUE_SOON:
        return "bg-yellow-500"
      case RenewalStatus.OVERDUE:
        return "bg-red-500"
      case RenewalStatus.RENEWED:
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Group contracts by renewal status
  const contractsByStatus = contracts.reduce((acc, contract) => {
    const status = contract.renewalStatus
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(contract)
    return acc
  }, {} as Record<RenewalStatus, AMCContract[]>)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(RenewalStatus).map(([key, status]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {status.replace(/_/g, ' ')}
              </CardTitle>
              <Badge className={getRenewalStatusColor(status)}>
                {contractsByStatus[status]?.length || 0}
              </Badge>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contracts Due for Renewal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Current End Date</TableHead>
                <TableHead>Renewal Status</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>License Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading contracts...
                  </TableCell>
                </TableRow>
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No contracts found
                  </TableCell>
                </TableRow>
              ) : (
                contracts
                  .filter(c => c.renewalStatus === RenewalStatus.DUE_SOON || c.renewalStatus === RenewalStatus.OVERDUE)
                  .map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.customerId}</TableCell>
                      <TableCell>{formatDate(contract.endDate)}</TableCell>
                      <TableCell>
                        <Badge className={getRenewalStatusColor(contract.renewalStatus)}>
                          {contract.renewalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(contract.totalValue)}</TableCell>
                      <TableCell>{contract.license.type}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            setSelectedContract(contract)
                            setShowRenewalForm(true)
                          }}
                          disabled={contract.renewalStatus === RenewalStatus.RENEWED}
                        >
                          Process Renewal
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showRenewalForm} onOpenChange={setShowRenewalForm}>
        <DialogContent className="sm:max-w-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRenewal)} className="space-y-4">
              <FormField
                control={form.control}
                name="newStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="updatedLicenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LicenseType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentAmount"
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select onValueChange={field.onChange}>
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
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRenewalForm(false)
                    setSelectedContract(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Process Renewal
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}