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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AMCContract, AMCPayment } from "@/services/amc/amcTypes"
import { AMCService } from "@/services/amc/amcService"

const amcService = new AMCService()

export function PaymentSchedule() {
  const [contracts, setContracts] = useState<AMCContract[]>([])
  const [payments, setPayments] = useState<Record<string, AMCPayment[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadContracts()
  }, [])

  useEffect(() => {
    if (selectedContract) {
      loadPayments(selectedContract)
    }
  }, [selectedContract])

  const loadContracts = async () => {
    try {
      const data = await amcService.listContracts()
      setContracts(data)
      if (data.length > 0 && !selectedContract) {
        setSelectedContract(data[0].id)
      }
    } catch (error) {
      console.error("Error loading contracts:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPayments = async (contractId: string) => {
    try {
      const data = await amcService.listPayments(contractId)
      setPayments(prev => ({
        ...prev,
        [contractId]: data
      }))
    } catch (error) {
      console.error("Error loading payments:", error)
    }
  }

  const handlePayment = async (contractId: string, payment: Omit<AMCPayment, 'id'>) => {
    try {
      await amcService.createPayment(payment)
      await loadPayments(contractId)
    } catch (error) {
      console.error("Error processing payment:", error)
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

  const getPaymentStatusColor = (status: AMCPayment['status']) => {
    switch (status) {
      case 'PAID':
        return "bg-green-500"
      case 'PENDING':
        return "bg-yellow-500"
      case 'OVERDUE':
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const selectedContractData = contracts.find(c => c.id === selectedContract)
  const contractPayments = payments[selectedContract] || []

  // Calculate payment statistics
  const totalPayments = contractPayments.length
  const paidPayments = contractPayments.filter(p => p.status === 'PAID').length
  const pendingPayments = contractPayments.filter(p => p.status === 'PENDING').length
  const overduePayments = contractPayments.filter(p => p.status === 'OVERDUE').length

  const filteredPayments = contractPayments.filter(payment => 
    payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Select value={selectedContract} onValueChange={setSelectedContract}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select contract" />
          </SelectTrigger>
          <SelectContent>
            {contracts.map(contract => (
              <SelectItem key={contract.id} value={contract.id}>
                {contract.customerId} - {formatCurrency(contract.totalValue)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {selectedContractData && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPayments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{paidPayments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overduePayments}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading payments...
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.dueDate)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                        </TableCell>
                        <TableCell>
                          {payment.transactionId || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.status === 'PENDING' && (
                            <Button
                              onClick={() => handlePayment(selectedContract, {
                                ...payment,
                                status: 'PAID',
                                paidDate: new Date(),
                                paymentMethod: 'BANK_TRANSFER',
                                transactionId: `TXN-${Date.now()}`
                              })}
                            >
                              Mark as Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}