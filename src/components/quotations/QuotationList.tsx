import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Quotation } from '@/services/quotation/quotationTypes';

interface QuotationListProps {
  quotations: Quotation[];
  onEdit: (quotation: Quotation) => void;
  onStatusChange: (id: string, status: Quotation['status']) => void;
}

const statusColors = {
  draft: 'bg-gray-500',
  sent: 'bg-blue-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500'
};

export function QuotationList({
  quotations,
  onEdit,
  onStatusChange
}: QuotationListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Opportunity</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell>{quotation.id}</TableCell>
              <TableCell>{quotation.accountId}</TableCell>
              <TableCell>{quotation.opportunityId}</TableCell>
              <TableCell>${quotation.total.toFixed(2)}</TableCell>
              <TableCell>
                {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[quotation.status]}>
                  {quotation.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(quotation)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {quotation.status === 'draft' && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(quotation.id, 'sent')}
                        >
                          Send Quotation
                        </DropdownMenuItem>
                      )}
                      {quotation.status === 'sent' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onStatusChange(quotation.id, 'accepted')}
                          >
                            Mark as Accepted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onStatusChange(quotation.id, 'rejected')}
                          >
                            Mark as Rejected
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default QuotationList;