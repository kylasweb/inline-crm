import { AssignmentRule, RuleCondition, Territory, AssignmentConfig, ExtendedLead } from './assignmentTypes';

class AssignmentRuleEngine {
  private rules: AssignmentRule[] = [];
  private territories: Territory[] = [];
  private config: AssignmentConfig = {
    defaultStrategy: 'rule_based',
    maxAttempts: 3,
    retryDelayMinutes: 5,
    workHoursOnly: true,
    allowReassignment: true,
    notifyOnAssignment: true
  };

  // Rule Management
  addRule(rule: AssignmentRule): void {
    this.validateRule(rule);
    this.rules.push(rule);
    this.sortRulesByPriority();
  }

  updateRule(ruleId: string, updates: Partial<AssignmentRule>): void {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index === -1) throw new Error('Rule not found');
    
    const updatedRule = { ...this.rules[index], ...updates };
    this.validateRule(updatedRule);
    this.rules[index] = updatedRule;
    this.sortRulesByPriority();
  }

  deleteRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  // Territory Management
  addTerritory(territory: Territory): void {
    this.validateTerritory(territory);
    this.territories.push(territory);
    this.sortTerritoriesByPriority();
  }

  updateTerritory(territoryId: string, updates: Partial<Territory>): void {
    const index = this.territories.findIndex(t => t.id === territoryId);
    if (index === -1) throw new Error('Territory not found');
    
    const updatedTerritory = { ...this.territories[index], ...updates };
    this.validateTerritory(updatedTerritory);
    this.territories[index] = updatedTerritory;
    this.sortTerritoriesByPriority();
  }

  deleteTerritory(territoryId: string): void {
    this.territories = this.territories.filter(t => t.id !== territoryId);
  }

  // Rule Validation
  private validateRule(rule: AssignmentRule): void {
    if (!rule.name || rule.name.trim().length === 0) {
      throw new Error('Rule must have a name');
    }

    if (!Array.isArray(rule.conditions) || rule.conditions.length === 0) {
      throw new Error('Rule must have at least one condition');
    }

    rule.conditions.forEach(this.validateCondition);

    if (!rule.action || !rule.action.type || !rule.action.target) {
      throw new Error('Rule must have a valid action');
    }

    if (rule.priority < 0) {
      throw new Error('Rule priority must be non-negative');
    }
  }

  private validateCondition(condition: RuleCondition): void {
    const validOperators = ['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan'];
    
    if (!condition.field || typeof condition.field !== 'string') {
      throw new Error('Condition must have a valid field');
    }

    if (!validOperators.includes(condition.operator)) {
      throw new Error(`Invalid operator. Must be one of: ${validOperators.join(', ')}`);
    }

    if (condition.value === undefined || condition.value === null) {
      throw new Error('Condition must have a value');
    }
  }

  private validateTerritory(territory: Territory): void {
    if (!territory.name || territory.name.trim().length === 0) {
      throw new Error('Territory must have a name');
    }

    if (!Array.isArray(territory.regions) || territory.regions.length === 0) {
      throw new Error('Territory must have at least one region');
    }

    if (!Array.isArray(territory.assignedUsers) || territory.assignedUsers.length === 0) {
      throw new Error('Territory must have at least one assigned user');
    }

    if (territory.priority < 0) {
      throw new Error('Territory priority must be non-negative');
    }
  }

  // Rule Evaluation
  evaluateRule(rule: AssignmentRule, lead: ExtendedLead): boolean {
    return rule.conditions.every(condition => this.evaluateCondition(condition, lead));
  }

  private evaluateCondition(condition: RuleCondition, lead: ExtendedLead): boolean {
    const value = this.getFieldValue(lead, condition.field);
    
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
      default:
        return false;
    }
  }

  // Field Access
  private getFieldValue(lead: ExtendedLead, field: string): any {
    const fields = field.split('.');
    let value: any = lead;
    
    for (const key of fields) {
      if (key === 'customFields' && value.customFields) {
        return value.customFields;
      }
      value = value?.[key];
      if (value === undefined) return undefined;
    }
    
    return value;
  }

  // Priority Management
  private sortRulesByPriority(): void {
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  private sortTerritoriesByPriority(): void {
    this.territories.sort((a, b) => b.priority - a.priority);
  }

  // Territory Matching
  findMatchingTerritory(lead: ExtendedLead): Territory | null {
    if (!lead.region) return null;
    
    return this.territories.find(territory => 
      territory.regions.some(region => 
        lead.region?.toLowerCase() === region.toLowerCase()
      )
    ) || null;
  }

  // Configuration
  updateConfig(updates: Partial<AssignmentConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  getConfig(): AssignmentConfig {
    return { ...this.config };
  }

  // Rule Access
  getAllRules(): AssignmentRule[] {
    return [...this.rules];
  }

  getActiveRules(): AssignmentRule[] {
    return this.rules.filter(rule => rule.isActive);
  }

  getRuleById(ruleId: string): AssignmentRule | undefined {
    return this.rules.find(rule => rule.id === ruleId);
  }

  // Territory Access
  getAllTerritories(): Territory[] {
    return [...this.territories];
  }

  getTerritoryById(territoryId: string): Territory | undefined {
    return this.territories.find(territory => territory.id === territoryId);
  }
}

export const assignmentRuleEngine = new AssignmentRuleEngine();