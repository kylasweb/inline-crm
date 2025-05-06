import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnrichmentProviderConfig } from '@/services/enrichment/enrichmentTypes';

const mockProviders: EnrichmentProviderConfig[] = [
  {
    id: 'company-data',
    name: 'Company Data Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.companydata.com',
    rateLimit: { requests: 100, period: 60 },
    timeout: 5000,
    priority: 1,
    enabled: true
  },
  {
    id: 'contact-info',
    name: 'Contact Info Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.contactverify.com',
    rateLimit: { requests: 200, period: 60 },
    timeout: 3000,
    priority: 2,
    enabled: true
  },
  {
    id: 'social-media',
    name: 'Social Media Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.socialmedia.com',
    rateLimit: { requests: 150, period: 60 },
    timeout: 4000,
    priority: 3,
    enabled: true
  },
  {
    id: 'tech-stack',
    name: 'Technology Stack Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.techdetect.com',
    rateLimit: { requests: 50, period: 60 },
    timeout: 6000,
    priority: 4,
    enabled: true
  }
];

export function EnrichmentProviderList() {
  const [providers, setProviders] = useState(mockProviders);

  const toggleProvider = (id: string) => {
    setProviders(providers.map(provider => 
      provider.id === id 
        ? { ...provider, enabled: !provider.enabled }
        : provider
    ));
  };

  const updateApiKey = (id: string, apiKey: string) => {
    setProviders(providers.map(provider =>
      provider.id === id
        ? { ...provider, apiKey }
        : provider
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Enrichment Providers</h2>
        <Button variant="outline">Add Provider</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rate Limit</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => {
            const buttonVariant = provider.enabled ? "secondary" : "outline";
            return (
              <TableRow key={provider.id}>
                <TableCell>
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-sm text-gray-500">{provider.baseUrl}</div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={provider.enabled}
                    onCheckedChange={() => toggleProvider(provider.id)}
                    className="mr-2"
                  />
                  <Badge variant={provider.enabled ? "secondary" : "destructive"}>
                    {provider.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {provider.rateLimit.requests} / {provider.rateLimit.period}s
                </TableCell>
                <TableCell>{provider.priority}</TableCell>
                <TableCell>
                  <Button variant={buttonVariant} size="sm">Configure</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Card className="p-4 mt-4">
        <p className="text-sm text-gray-500">
          Note: Changes to provider configurations will affect all future enrichment operations.
          Existing enriched data will not be automatically updated.
        </p>
      </Card>
    </div>
  );
}