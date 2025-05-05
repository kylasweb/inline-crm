import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import OpportunityForm from './OpportunityForm';
import { opportunityService } from '@/services/opportunity/opportunityService';
import { CreateOpportunityDTO, Opportunity } from '@/services/opportunity/opportunityTypes';

interface OpportunityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<CreateOpportunityDTO>;
  mode: 'create' | 'edit';
  opportunityId?: string;
}

const OpportunityFormDialog: React.FC<OpportunityFormDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  mode,
  opportunityId
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateOpportunityDTO) => opportunityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      onOpenChange(false);
      toast({
        title: 'Success',
        description: 'Opportunity created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create opportunity',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateOpportunityDTO) => 
      opportunityService.update(opportunityId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      onOpenChange(false);
      toast({
        title: 'Success',
        description: 'Opportunity updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update opportunity',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: CreateOpportunityDTO) => {
    if (mode === 'create') {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Opportunity' : 'Edit Opportunity'}
          </DialogTitle>
        </DialogHeader>
        <OpportunityForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityFormDialog;