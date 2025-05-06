import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { quotationService } from '@/services/quotation/quotationService';
import { Quotation, CreateQuotationDTO } from '@/services/quotation/quotationTypes';
import QuotationList from '@/components/quotations/QuotationList';
import QuotationFormDialog from '@/components/quotations/QuotationFormDialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NeoCard from '@/components/ui/neo-card';

export function Quotations() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: quotationsData, isLoading: isFetching, error } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const response = await quotationService.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch quotations');
    }
  });

  const quotations = quotationsData || [];

  const handleCreateOrUpdate = async (data: CreateQuotationDTO) => {
    setIsLoading(true);
    try {
      let response;
      if (selectedQuotation) {
        response = await quotationService.update(selectedQuotation.id, data);
      } else {
        response = await quotationService.create(data);
      }

      if (response.success) {
        toast({
          title: 'Success',
          description: selectedQuotation
            ? 'Quotation updated successfully'
            : 'Quotation created successfully',
        });
        setDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['quotations'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'Operation failed',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDialogOpen(true);
  };

  const handleStatusChange = async (id: string, status: Quotation['status']) => {
    try {
      const statusActions = {
        sent: quotationService.send,
        accepted: quotationService.accept,
        rejected: quotationService.reject,
      };

      const action = statusActions[status];
      if (!action) return;

      const response = await action(id);
      if (response.success) {
        toast({
          title: 'Success',
          description: `Quotation status updated to ${status}`,
        });
        queryClient.invalidateQueries({ queryKey: ['quotations'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'Failed to update status',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedQuotation(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <NeoCard className="p-6 text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-neo-text-secondary mb-4">
            Failed to load quotations data. Please try again.
          </p>
          <Button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['quotations'] });
            }}
            className="neo-button"
          >
            Retry
          </Button>
        </NeoCard>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-neo-primary">Loading quotations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quotations</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Quotation
        </Button>
      </div>

      {quotations.length === 0 ? (
        <div className="text-center py-10">
          <div className="flex flex-col items-center justify-center text-neo-text-secondary">
            <FileText className="h-12 w-12 mb-2 opacity-50" />
            <p>No quotations found</p>
            <p className="text-sm mb-4">Create your first quotation to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quotation
            </Button>
          </div>
        </div>
      ) : (
        <QuotationList
          quotations={quotations}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      <QuotationFormDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedQuotation || undefined}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Quotations;