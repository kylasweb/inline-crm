import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LeadEnrichmentData, EnrichmentStatus } from '@/services/enrichment/enrichmentTypes';

interface EnrichmentHistoryProps {
  data: LeadEnrichmentData[];
}

interface EnrichmentHistoryEntry {
  id: string;
  leadId: string;
  leadName: string;
  status: EnrichmentStatus['status'];
  startedAt: string;
  completedAt?: string;
  providers: {
    name: string;
    status: 'success' | 'failed' | 'skipped';
  }[];
  enrichedFields: string[];
}

export function EnrichmentHistory({ data }: EnrichmentHistoryProps) {
  const [historyEntries, setHistoryEntries] = useState<EnrichmentHistoryEntry[]>([]);
  const [sortField, setSortField] = useState<keyof EnrichmentHistoryEntry>('startedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // In real implementation, this would process the actual enrichment data
    // For now, using mock data
    const mockHistory: EnrichmentHistoryEntry[] = [
      {
        id: '1',
        leadId: 'lead-1',
        leadName: 'Acme Corp',
        status: 'completed',
        startedAt: '2025-05-06T12:00:00Z',
        completedAt: '2025-05-06T12:01:00Z',
        providers: [
          { name: 'Company Data', status: 'success' },
          { name: 'Contact Info', status: 'success' },
          { name: 'Social Media', status: 'success' }
        ],
        enrichedFields: ['company', 'contact', 'social']
      },
      {
        id: '2',
        leadId: 'lead-2',
        leadName: 'TechStart Inc',
        status: 'failed',
        startedAt: '2025-05-06T11:00:00Z',
        completedAt: '2025-05-06T11:00:30Z',
        providers: [
          { name: 'Company Data', status: 'success' },
          { name: 'Contact Info', status: 'failed' },
          { name: 'Social Media', status: 'skipped' }
        ],
        enrichedFields: ['company']
      }
    ];

    setHistoryEntries(mockHistory);
  }, [data]);

  const handleSort = (field: keyof EnrichmentHistoryEntry) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadgeVariant = (status: EnrichmentStatus['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'in_progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Enrichment History</h2>
        <Button variant="outline">Export History</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('leadName')}>
              Lead Name
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
              Status
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('startedAt')}>
              Date
            </TableHead>
            <TableHead>Providers</TableHead>
            <TableHead>Enriched Fields</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyEntries
            .sort((a, b) => {
              const compareResult = String(a[sortField]).localeCompare(String(b[sortField]));
              return sortDirection === 'asc' ? compareResult : -compareResult;
            })
            .map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="font-medium">{entry.leadName}</div>
                  <div className="text-sm text-gray-500">ID: {entry.leadId}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(entry.status)}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>{new Date(entry.startedAt).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.startedAt).toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {entry.providers.map((provider, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                      >
                        {provider.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {entry.enrichedFields.map((field, idx) => (
                      <Badge key={idx} variant="outline">{field}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}