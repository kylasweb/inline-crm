import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAssignmentStore } from '@/stores/assignment.store';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { assignmentService } from '@/services/assignment/assignmentService';
import { AssignmentRule } from '@/services/assignment/assignmentTypes';
import { AssignmentRuleForm } from './AssignmentRuleForm';

export function AssignmentRuleList() {
  const { rules, isLoading, fetchRules, toggleRuleStatus } = useAssignmentStore();
  const [editingRule, setEditingRule] = useState<AssignmentRule | null>(null);
  const [deletingRule, setDeletingRule] = useState<AssignmentRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleDeleteRule = async (ruleId: string) => {
    await useAssignmentStore.getState().deleteRule(ruleId);
    setDeletingRule(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Assignment Rules</h2>
        {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Conditions</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.name}</TableCell>
              <TableCell>{rule.priority}</TableCell>
              <TableCell>
                {rule.conditions.map((condition, idx) => (
                  <div key={idx}>
                    {condition.field} {condition.operator} {condition.value}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                {rule.action.type} → {rule.action.target}
                {rule.action.fallback && (
                  <div className="text-sm text-muted-foreground">
                    Fallback: {rule.action.fallback}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingRule(rule)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingRule(rule)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent className="max-w-2xl">
          {editingRule && (
            <AssignmentRuleForm
              rule={editingRule}
              onSuccess={() => setEditingRule(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingRule} onOpenChange={() => setDeletingRule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assignment rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingRule) {
                  handleDeleteRule(deletingRule.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}