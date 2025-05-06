import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import LeadForm from './LeadForm';
import { useLeadsStore } from '@/stores/leads.store';

const LeadFormDialog: React.FC = () => {
  const { toast } = useToast();
  const { isCreateDialogOpen, setCreateDialogOpen } = useLeadsStore();

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Lead created successfully",
    });
    setCreateDialogOpen(false);
  };

  const handleError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <LeadForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormDialog;