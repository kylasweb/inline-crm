import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

import { AssignmentRuleList } from '@/components/assignment/AssignmentRuleList';
import { AssignmentRuleForm } from '@/components/assignment/AssignmentRuleForm';
import { AssignmentStats } from '@/components/assignment/AssignmentStats';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function AssignmentManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignment Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AssignmentRuleForm
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <AssignmentStats />
      </Card>

      <Card className="p-6">
        <AssignmentRuleList />
      </Card>
    </div>
  );
}