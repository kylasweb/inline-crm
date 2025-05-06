import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button,
} from "@/components/ui/";
import { Card } from "@/components/ui/card";
import { ScoringRule, RuleCondition } from "@/services/qualification/qualificationTypes";

const ruleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.enum(["demographic", "company", "engagement", "custom"]),
  score: z.number().min(0).max(100),
  priority: z.number().min(1).max(10),
  conditions: z.array(z.object({
    field: z.string().min(1, "Field is required"),
    operator: z.enum(["equals", "notEquals", "contains", "greaterThan", "lessThan", "between"]),
    value: z.string().min(1, "Value is required"),
    secondaryValue: z.string().optional(),
  })).min(1, "At least one condition is required"),
});

type RuleFormData = z.infer<typeof ruleFormSchema>;

interface QualificationRuleFormProps {
  initialData?: ScoringRule;
  onSubmit: (data: ScoringRule) => void;
  onCancel: () => void;
}

const QualificationRuleForm: React.FC<QualificationRuleFormProps> = ({ 
  initialData,
  onSubmit,
  onCancel 
}) => {
  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      category: "demographic",
      score: 0,
      priority: 1,
      conditions: [{
        field: "",
        operator: "equals",
        value: "",
      }],
    },
  });

  const handleSubmit = (values: RuleFormData) => {
    const scoringRule: ScoringRule = {
      id: initialData?.id || crypto.randomUUID(),
      name: values.name,
      description: values.description,
      category: values.category,
      score: values.score,
      priority: values.priority,
      conditions: values.conditions as RuleCondition[],
      isActive: initialData?.isActive ?? true,
    };
    onSubmit(scoringRule);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rule Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter rule name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter rule description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="demographic">Demographic</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      max={100}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority (1-10)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={10}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export { QualificationRuleForm };