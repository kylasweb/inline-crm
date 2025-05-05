import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/account/accountService';
import { Account } from '@/services/account/accountTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NeoCard from '@/components/ui/neo-card';
import NeoBadge from '@/components/ui/neo-badge';
import { ArrowUpRight, FileText, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { AccountFormDialog } from '@/components/accounts/AccountFormDialog';

const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Other'
];

interface AccountManagementProps {
  filter?: string;
  activeTab?: string;
}

const AccountManagement: React.FC<AccountManagementProps> = ({ filter, activeTab = "list" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All Industries');
  const [typeFilter, setTypeFilter] = useState<Account['type'] | 'All Types'>('All Types');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ['accounts', searchQuery, industryFilter, typeFilter],
    queryFn: () => accountService.getAccounts({
      search: searchQuery,
      industry: industryFilter !== 'All Industries' ? industryFilter : undefined,
      type: typeFilter !== 'All Types' ? typeFilter : undefined
    })
  });

  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-neo-primary">Loading accounts...</p>
      </div>
    );
  }

  const accounts = accountsData?.accounts || [];
  const customerCount = accounts.filter(acc => acc.type === 'customer').length;
  const prospectCount = accounts.filter(acc => acc.type === 'prospect').length;
  const partnerCount = accounts.filter(acc => acc.type === 'partner').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Account Management</h1>
          <p className="text-neo-text-secondary">Manage customer, prospect, and partner accounts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="neo-button" onClick={handleCreateAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
          <Button variant="outline" className="neo-flat">
            <FileText className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Total Customers</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{customerCount}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Active customer accounts</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Active Prospects</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{prospectCount}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Potential customers in pipeline</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Partners</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{partnerCount}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Active partner relationships</p>
        </NeoCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neo-text-secondary h-4 w-4" />
          <Input
            placeholder="Search accounts..."
            className="pl-10 neo-flat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-40 neo-flat">
              <SelectValue placeholder="Filter by Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Industries">All Industries</SelectItem>
              {INDUSTRY_OPTIONS.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
            <SelectTrigger className="w-36 neo-flat">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Types">All Types</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="neo-flat">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Account List */}
      <div className="overflow-x-auto neo-flat rounded-lg p-1">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neo-border">
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Name</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Type</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Industry</th>
              <th className="text-center py-3 px-4 text-neo-text-secondary font-medium">Contacts</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Primary Contact</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr 
                key={account.id} 
                className="border-b border-neo-border hover:bg-neo-bg/50 cursor-pointer"
                onClick={() => handleEditAccount(account)}
              >
                <td className="py-3 px-4">{account.name}</td>
                <td className="py-3 px-4">
                  <NeoBadge variant={
                    account.type === 'customer' ? 'success' :
                    account.type === 'prospect' ? 'warning' : 'primary'
                  }>
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                  </NeoBadge>
                </td>
                <td className="py-3 px-4">{account.industry}</td>
                <td className="py-3 px-4 text-center">{account.contacts.length}</td>
                <td className="py-3 px-4">
                  {account.contacts.find(c => c.isPrimary)?.name || '-'}
                </td>
                <td className="py-3 px-4">
                  {account.addresses.find(a => a.isPrimary)?.city || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Dialog */}
      <AccountFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={selectedAccount ? 'edit' : 'create'}
        initialData={selectedAccount}
        accountId={selectedAccount?.id}
      />
    </div>
  );
};

export default AccountManagement;