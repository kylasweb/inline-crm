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
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AMCContract, License, LicenseType } from "@/services/amc/amcTypes"
import { AMCService } from "@/services/amc/amcService"

const amcService = new AMCService()

export function LicenseManager() {
  const [contracts, setContracts] = useState<AMCContract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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

  const handleToggleLicense = async (contractId: string, isActive: boolean) => {
    try {
      await amcService.toggleLicense(contractId, isActive)
      await loadContracts()
    } catch (error) {
      console.error("Error toggling license:", error)
    }
  }

  const filteredContracts = contracts.filter(contract => 
    contract.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.license.key.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const getLicenseTypeColor = (type: LicenseType) => {
    switch (type) {
      case LicenseType.BASIC:
        return "bg-gray-500"
      case LicenseType.STANDARD:
        return "bg-blue-500"
      case LicenseType.PREMIUM:
        return "bg-purple-500"
      case LicenseType.ENTERPRISE:
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const isLicenseExpiringSoon = (license: License) => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return new Date(license.expiryDate) <= thirtyDaysFromNow
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search licenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>License Type</TableHead>
                <TableHead>License Key</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading licenses...
                  </TableCell>
                </TableRow>
              ) : filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No licenses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.customerId}</TableCell>
                    <TableCell>
                      <Badge className={getLicenseTypeColor(contract.license.type)}>
                        {contract.license.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{contract.license.key}</code>
                    </TableCell>
                    <TableCell>{formatDate(contract.license.issuedDate)}</TableCell>
                    <TableCell>
                      <span className={isLicenseExpiringSoon(contract.license) ? "text-red-500" : ""}>
                        {formatDate(contract.license.expiryDate)}
                      </span>
                    </TableCell>
                    <TableCell>{contract.license.maxUsers}</TableCell>
                    <TableCell>
                      {contract.license.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Switch
                          checked={contract.license.isActive}
                          onCheckedChange={(checked) => 
                            handleToggleLicense(contract.id, checked)
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!contract.license.isActive}
                          onClick={() => {
                            // Download license details
                            const licenseData = {
                              ...contract.license,
                              customerId: contract.customerId,
                              features: contract.license.features.join(", ")
                            }
                            const blob = new Blob([JSON.stringify(licenseData, null, 2)], 
                              { type: 'application/json' }
                            )
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `license-${contract.license.key}.json`
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                            URL.revokeObjectURL(url)
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}