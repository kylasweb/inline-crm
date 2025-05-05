import { 
  ScoringRule, 
  RuleCondition, 
  QualifiedLead,
  RuleEvaluationResult
} from './qualificationTypes';

// Rule validator functions
const validateCondition = (condition: RuleCondition, value: any): boolean => {
  switch (condition.operator) {
    case 'equals':
      return value === condition.value;
    case 'notEquals':
      return value !== condition.value;
    case 'contains':
      return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
    case 'greaterThan':
      return Number(value) > Number(condition.value);
    case 'lessThan':
      return Number(value) < Number(condition.value);
    case 'between':
      return Number(value) >= Number(condition.value) && 
             Number(value) <= Number(condition.secondaryValue);
    default:
      return false;
  }
};

// Default scoring templates
export const defaultScoringTemplates: ScoringRule[] = [
  {
    id: 'company-size',
    name: 'Company Size Score',
    description: 'Score based on company employee count',
    conditions: [
      {
        field: 'employeeCount',
        operator: 'between',
        value: 100,
        secondaryValue: 1000
      }
    ],
    score: 20,
    category: 'company',
    priority: 1,
    isActive: true
  },
  {
    id: 'engagement-email',
    name: 'Email Engagement Score',
    description: 'Score based on email interactions',
    conditions: [
      {
        field: 'emailInteractions',
        operator: 'greaterThan',
        value: 5
      }
    ],
    score: 15,
    category: 'engagement',
    priority: 2,
    isActive: true
  }
];

export const scoringRulesService = {
  // Evaluate a single rule against a lead
  evaluateRule(rule: ScoringRule, lead: QualifiedLead): RuleEvaluationResult {
    if (!rule.isActive) {
      return {
        ruleId: rule.id,
        matched: false,
        score: 0,
        category: rule.category
      };
    }

    const allConditionsMatch = rule.conditions.every(condition => {
      const fieldValue = this.getLeadFieldValue(lead, condition.field);
      return validateCondition(condition, fieldValue);
    });

    return {
      ruleId: rule.id,
      matched: allConditionsMatch,
      score: allConditionsMatch ? rule.score : 0,
      category: rule.category
    };
  },

  // Get nested field value from lead object
  getLeadFieldValue(lead: QualifiedLead, field: string): any {
    const fields = field.split('.');
    let value: any = lead;
    
    for (const f of fields) {
      if (value === null || value === undefined) return null;
      value = value[f];
    }
    
    return value;
  },

  // Validate rule definition
  validateRule(rule: ScoringRule): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!rule.id) errors.push('Rule ID is required');
    if (!rule.name) errors.push('Rule name is required');
    if (!rule.conditions || rule.conditions.length === 0) {
      errors.push('At least one condition is required');
    }
    if (typeof rule.score !== 'number') {
      errors.push('Score must be a number');
    }
    if (rule.priority < 0) errors.push('Priority must be non-negative');

    rule.conditions?.forEach((condition, index) => {
      if (!condition.field) {
        errors.push(`Condition ${index + 1}: Field is required`);
      }
      if (!condition.operator) {
        errors.push(`Condition ${index + 1}: Operator is required`);
      }
      if (condition.operator === 'between' && !condition.secondaryValue) {
        errors.push(`Condition ${index + 1}: Secondary value is required for 'between' operator`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Sort rules by priority
  sortRulesByPriority(rules: ScoringRule[]): ScoringRule[] {
    return [...rules].sort((a, b) => a.priority - b.priority);
  },

  // Get template rules
  getDefaultTemplates(): ScoringRule[] {
    return defaultScoringTemplates;
  }
};