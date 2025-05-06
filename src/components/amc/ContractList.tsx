import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AMCContract, ContractStatus, RenewalStatus } from "@/services/amc/amcTypes"
import { AMCService } from "@/services/amc/amcService"
import { ContractForm } from "./ContractForm"

const amcService = new AMCService()

export function ContractList() {
  const [contracts, setContracts] = useState<AMCContract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "">("")
  const [renewalFilter, setRenewalFilter] = useState<RenewalStatus | "">("")
  const [showForm, setShowForm] = useState(false)
  const [selectedContract, setSelectedContract] = useState<AMCContract | undefined>()

  useEffect(() => {
    loadContracts()
  }, [statusFilter, renewalFilter])

  const loadContracts = async () => {
    try {
      const filters: {
        status?: ContractStatus
        renewalStatus?: RenewalStatus
      } = {}

      if (statusFilter) filters.status = statusFilter
      if (renewalFilter) filters.renewalStatus = renewalFilter

      const data = await amcService.listContracts(filters)
      setContracts(data)
    } catch (error) {
      console.error("Error loading contracts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleContractSubmit = async (contract: AMCContract) => {
    await loadContracts()
    setShowForm(false)
    setSelectedContract(undefined)
  }

  const handleEdit = (contract: AMCContract) => {
    setSelectedContract(contract)
    setShowForm(true)
  }

  const filteredContracts = contracts.filter(contract => 
    contract.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select 
            value={statusFilter}
            onValueChange={(value: ContractStatus | "") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {Object.values(ContractStatus).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={renewalFilter}
            onValueChange={(value: RenewalStatus | "") => setRenewalFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by renewal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Renewal Status</SelectItem>
              {Object.values(RenewalStatus).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowForm(true)}>
          Add Contract
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Renewal Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading contracts...
                  </TableCell>
                </TableRow>
              ) : filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No contracts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.customerId}</TableCell>
                    <TableCell>{contract.status}</TableCell>
                    <TableCell>{formatDate(contract.startDate)}</TableCell>
                    <TableCell>{formatDate(contract.endDate)}</TableCell>
                    <TableCell>{formatCurrency(contract.totalValue)}</TableCell>
                    <TableCell>{contract.renewalStatus}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contract)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <ContractForm
            contract={selectedContract}
            onSubmit={handleContractSubmit}
            onCancel={() => {
              setShowForm(false)
              setSelectedContract(undefined)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}