import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QuotationForm from './QuotationForm';
import { CreateQuotationDTO } from '@/services/quotation/quotationTypes';

interface QuotationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateQuotationDTO) => void;
  initialData?: Partial<CreateQuotationDTO>;
  isLoading?: boolean;
}

export function QuotationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false
}: QuotationFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Quotation' : 'Create New Quotation'}
          </DialogTitle>
        </DialogHeader>
        <QuotationForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

export default QuotationFormDialog;