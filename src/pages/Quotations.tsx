import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { quotationService } from '@/services/quotation/quotationService';
import { Quotation, CreateQuotationDTO } from '@/services/quotation/quotationTypes';
import QuotationList from '@/components/quotations/QuotationList';
import QuotationFormDialog from '@/components/quotations/QuotationFormDialog';

export function Quotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchQuotations = async () => {
    setIsFetching(true);
    try {
      const response = await quotationService.getAll();
      if (response.success && response.data) {
        setQuotations(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'Failed to fetch quotations',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

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
        fetchQuotations();
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
        fetchQuotations();
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

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-neo-text-secondary">Loading quotations...</p>
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
          <p className="text-neo-text-secondary">No quotations found.</p>
          <Button className="mt-4" onClick={() => setDialogOpen(true)}>
            Create your first quotation
          </Button>
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