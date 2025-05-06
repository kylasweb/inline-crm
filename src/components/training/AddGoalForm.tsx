import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Goal {
  id?: string;
  title?: string;
  description?: string;
  category?: 'skill' | 'certification' | 'project';
  priority?: 'high' | 'medium' | 'low';
  deadline?: Date;
  targetHours?: number;
  completedHours?: number;
  milestones?: {
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
  }[];
  status?: 'not_started' | 'in_progress' | 'completed';
  tags?: string[];
  metrics?: {
    type: string;
    target: number;
    current: number;
  }[];
}

interface AddGoalFormProps {
  goal: Partial<Goal>;
  onUpdate: (updates: Partial<Goal>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AddGoalForm({ goal, onUpdate, onSubmit, onCancel }: AddGoalFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Input
            placeholder="Goal Title"
            value={goal.title || ''}
            onChange={(e) =>
              onUpdate({ title: e.target.value })
            }
          />

          <Textarea
            placeholder="Description"
            value={goal.description || ''}
            onChange={(e) =>
              onUpdate({ description: e.target.value })
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Select
              value={goal.category}
              onValueChange={(value: Goal['category']) =>
                onUpdate({ category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skill">Skill</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={goal.priority}
              onValueChange={(value: Goal['priority']) =>
                onUpdate({ priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Target Hours"
              value={goal.targetHours || ''}
              onChange={(e) =>
                onUpdate({
                  targetHours: parseInt(e.target.value)
                })
              }
            />
          </div>

          <Input
            type="date"
            value={goal.deadline?.toISOString().split('T')[0]}
            onChange={(e) =>
              onUpdate({
                deadline: new Date(e.target.value)
              })
            }
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit}>
              Add Goal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}