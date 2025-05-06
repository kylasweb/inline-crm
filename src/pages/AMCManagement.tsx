import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractList } from "../components/amc/ContractList"
import { LicenseManager } from "../components/amc/LicenseManager"
import { RenewalDashboard } from "../components/amc/RenewalDashboard"
import { PaymentSchedule } from "../components/amc/PaymentSchedule"

export default function AMCManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AMC & License Management</h1>
      </div>

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="renewals">Renewals</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AMC Contracts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ContractList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>License Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <LicenseManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewals">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Renewal Dashboard</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <RenewalDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Payment Schedule</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <PaymentSchedule />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}