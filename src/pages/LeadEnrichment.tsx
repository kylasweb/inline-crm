import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnrichmentProviderList } from '@/components/enrichment/EnrichmentProviderList';
import { EnrichmentSettings } from '@/components/enrichment/EnrichmentSettings';
import { EnrichmentHistory } from '@/components/enrichment/EnrichmentHistory';
import { EnrichmentMetrics } from '@/components/enrichment/EnrichmentMetrics';
import { LeadEnrichmentData } from '@/services/enrichment/enrichmentTypes';
import { enrichmentService } from '@/services/enrichment/enrichmentService';

export default function LeadEnrichment() {
  const [activeTab, setActiveTab] = useState('providers');
  const [enrichmentData, setEnrichmentData] = useState<LeadEnrichmentData[]>([]);

  useEffect(() => {
    // In real implementation, fetch enrichment data for leads
    // This is just mock data for now
    setEnrichmentData([]);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lead Enrichment</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="p-6">
          <EnrichmentMetrics data={enrichmentData} />
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <Card className="p-6">
            <EnrichmentProviderList />
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <EnrichmentSettings />
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <EnrichmentHistory data={enrichmentData} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}