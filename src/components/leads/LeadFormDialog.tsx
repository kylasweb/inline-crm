import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import LeadForm from './LeadForm';
import { LeadFormData, leadService } from '@/services/leadService';

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const response = await leadService.createLead(data);
      if (response.success) {
        toast({
          title: "Success",
          description: "Lead created successfully",
        });
        onSuccess?.();
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create lead",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <LeadForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormDialog;