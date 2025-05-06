import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { ScoringRule } from '@/services/qualification/qualificationTypes';
import { scoringRulesService } from '@/services/qualification/scoringRules';

export const QualificationRuleList = () => {
  const [rules, setRules] = useState<ScoringRule[]>([]);

  useEffect(() => {
    const loadRules = async () => {
      const activeRules = await scoringRulesService.getDefaultTemplates();
      setRules(activeRules);
    };
    loadRules();
  }, []);

  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive } : rule
    );
    setRules(updatedRules);
    // In a real implementation, this would call an API to update the rule
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Qualification Rules</h2>
        <Button>Add New Rule</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{rule.category}</Badge>
              </TableCell>
              <TableCell>{rule.score}</TableCell>
              <TableCell>{rule.priority}</TableCell>
              <TableCell>
                <Switch 
                  checked={rule.isActive}
                  onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)}
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};