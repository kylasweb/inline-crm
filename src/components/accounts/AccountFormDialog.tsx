import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AccountForm } from '@/components/accounts/AccountForm';
import { accountService } from '@/services/account/accountService';
import { Account } from '@/services/account/accountTypes';

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Account;
  mode: 'create' | 'edit';
  accountId?: string;
}

export const AccountFormDialog: React.FC<AccountFormDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  mode,
  accountId
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Account>) => accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onOpenChange(false);
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Account>) => 
      accountService.updateAccount(accountId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onOpenChange(false);
      toast({
        title: 'Success',
        description: 'Account updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update account',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: Partial<Account>) => {
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
            {mode === 'create' ? 'Create New Account' : 'Edit Account'}
          </DialogTitle>
        </DialogHeader>
        <AccountForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};