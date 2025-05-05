import { ApiResponse, Lead } from '../api';
import { assignmentRuleEngine } from './assignmentRules';
import {
  ExtendedLead,
  AssignmentResult,
  TeamMemberCapacity,
  AssignmentHistory,
  AssignmentQueueItem,
  AssignmentStrategy,
  AssignmentConfig
} from './assignmentTypes';

class AssignmentService {
  private teamCapacity: Map<string, TeamMemberCapacity> = new Map();
  private assignmentHistory: AssignmentHistory[] = [];
  private assignmentQueue: AssignmentQueueItem[] = [];
  private roundRobinIndex: number = 0;

  // Assignment Strategies
  async assignLead(lead: Lead): Promise<AssignmentResult> {
    const extendedLead = this.enrichLead(lead);
    const config = assignmentRuleEngine.getConfig();

    // Try rule-based assignment first
    const ruleResult = await this.applyRuleBasedAssignment(extendedLead);
    if (ruleResult.success) return ruleResult;

    // Try territory-based assignment
    const territoryResult = await this.applyTerritoryBasedAssignment(extendedLead);
    if (territoryResult.success) return territoryResult;

    // Use default strategy as fallback
    return this.applyStrategy(config.defaultStrategy, extendedLead);
  }

  private async applyStrategy(
    strategy: AssignmentStrategy,
    lead: ExtendedLead
  ): Promise<AssignmentResult> {
    switch (strategy) {
      case 'rule_based':
        return this.applyRuleBasedAssignment(lead);
      case 'round_robin':
        return this.applyRoundRobinAssignment(lead);
      case 'load_balance':
        return this.applyLoadBalancedAssignment(lead);
      case 'territory':
        return this.applyTerritoryBasedAssignment(lead);
      case 'priority':
        return this.applyPriorityBasedAssignment(lead);
      default:
        return this.applyRoundRobinAssignment(lead);
    }
  }

  // Rule-based Assignment
  private async applyRuleBasedAssignment(lead: ExtendedLead): Promise<AssignmentResult> {
    const activeRules = assignmentRuleEngine.getActiveRules();
    
    for (const rule of activeRules) {
      if (assignmentRuleEngine.evaluateRule(rule, lead)) {
        const assignee = await this.validateAssignee(rule.action.target);
        if (assignee) {
          this.recordAssignment(lead.id, assignee, 'rule', rule.name);
          return {
            success: true,
            assignedTo: assignee,
            rule,
            timestamp: new Date()
          };
        }
      }
    }

    return {
      success: false,
      reason: 'No matching rules found',
      timestamp: new Date()
    };
  }

  // Round-robin Assignment
  private async applyRoundRobinAssignment(lead: ExtendedLead): Promise<AssignmentResult> {
    const availableUsers = Array.from(this.teamCapacity.values())
      .filter(member => member.availability);

    if (availableUsers.length === 0) {
      return {
        success: false,
        reason: 'No available team members',
        timestamp: new Date()
      };
    }

    this.roundRobinIndex = (this.roundRobinIndex + 1) % availableUsers.length;
    const assignee = availableUsers[this.roundRobinIndex];

    this.recordAssignment(lead.id, assignee.userId, 'round_robin');
    return {
      success: true,
      assignedTo: assignee.userId,
      timestamp: new Date()
    };
  }

  // Load-balanced Assignment
  private async applyLoadBalancedAssignment(lead: ExtendedLead): Promise<AssignmentResult> {
    const availableUsers = Array.from(this.teamCapacity.values())
      .filter(member => member.availability && member.currentLeads < member.maxLeads)
      .sort((a, b) => (a.currentLeads / a.maxLeads) - (b.currentLeads / b.maxLeads));

    if (availableUsers.length === 0) {
      return {
        success: false,
        reason: 'No available team members with capacity',
        timestamp: new Date()
      };
    }

    const assignee = availableUsers[0];
    this.updateTeamMemberCapacity(assignee.userId, assignee.currentLeads + 1);
    this.recordAssignment(lead.id, assignee.userId, 'load_balance');

    return {
      success: true,
      assignedTo: assignee.userId,
      timestamp: new Date()
    };
  }

  // Territory-based Assignment
  private async applyTerritoryBasedAssignment(lead: ExtendedLead): Promise<AssignmentResult> {
    const territory = assignmentRuleEngine.findMatchingTerritory(lead);
    if (!territory) {
      return {
        success: false,
        reason: 'No matching territory found',
        timestamp: new Date()
      };
    }

    // Find available user in territory
    const territoryUser = await this.findAvailableUserInTerritory(territory.assignedUsers);
    if (!territoryUser) {
      return {
        success: false,
        reason: 'No available users in territory',
        timestamp: new Date()
      };
    }

    this.recordAssignment(lead.id, territoryUser, 'territory', undefined, territory.id);
    return {
      success: true,
      assignedTo: territoryUser,
      territory,
      timestamp: new Date()
    };
  }

  // Priority-based Assignment
  private async applyPriorityBasedAssignment(lead: ExtendedLead): Promise<AssignmentResult> {
    const priorityScore = this.calculatePriorityScore(lead);
    
    // Add to priority queue
    this.assignmentQueue.push({
      lead,
      priority: priorityScore,
      attempts: 0,
      lastAttempt: new Date()
    });

    // Sort queue by priority
    this.assignmentQueue.sort((a, b) => b.priority - a.priority);
    
    // Process high-priority leads first
    return this.processHighPriorityLead(lead);
  }

  // Helper Methods
  private enrichLead(lead: Lead): ExtendedLead {
    // Enrich lead with additional data needed for assignment
    return {
      ...lead,
      region: this.determineRegion(lead),
      priority: this.calculatePriorityScore(lead),
      industry: this.extractIndustry(lead),
      dealSize: this.estimateDealSize(lead)
    };
  }

  private determineRegion(lead: Lead): string | undefined {
    // Implement region determination logic based on lead data
    // This could use address, phone number area code, IP location, etc.
    return undefined; // Placeholder
  }

  private calculatePriorityScore(lead: ExtendedLead): number {
    let score = 0;
    
    // Factor in lead score
    score += lead.score || 0;
    
    // Factor in deal size if available
    if (lead.dealSize) {
      score += Math.log10(lead.dealSize);
    }
    
    // Prioritize based on status
    if (lead.status === 'Hot') score += 30;
    if (lead.status === 'Warm') score += 15;
    
    return score;
  }

  private extractIndustry(lead: Lead): string | undefined {
    // Implement industry extraction logic
    return undefined; // Placeholder
  }

  private estimateDealSize(lead: Lead): number | undefined {
    // Implement deal size estimation logic
    return undefined; // Placeholder
  }

  private async validateAssignee(userId: string): Promise<string | null> {
    const capacity = this.teamCapacity.get(userId);
    if (!capacity || !capacity.availability) return null;
    if (capacity.currentLeads >= capacity.maxLeads) return null;
    return userId;
  }

  private async findAvailableUserInTerritory(users: string[]): Promise<string | null> {
    for (const userId of users) {
      const isValid = await this.validateAssignee(userId);
      if (isValid) return userId;
    }
    return null;
  }

  private async processHighPriorityLead(lead: ExtendedLead): Promise<AssignmentResult> {
    // Find best available agent based on lead priority
    const availableUsers = Array.from(this.teamCapacity.values())
      .filter(member => member.availability)
      .sort((a, b) => b.specialties.length - a.specialties.length);

    if (availableUsers.length === 0) {
      return {
        success: false,
        reason: 'No available team members for high-priority lead',
        timestamp: new Date()
      };
    }

    const assignee = availableUsers[0];
    this.recordAssignment(lead.id, assignee.userId, 'priority');
    
    return {
      success: true,
      assignedTo: assignee.userId,
      timestamp: new Date()
    };
  }

  // Capacity Management
  updateTeamMemberCapacity(userId: string, currentLeads: number): void {
    const capacity = this.teamCapacity.get(userId);
    if (capacity) {
      this.teamCapacity.set(userId, { ...capacity, currentLeads });
    }
  }

  setTeamMemberAvailability(userId: string, available: boolean): void {
    const capacity = this.teamCapacity.get(userId);
    if (capacity) {
      this.teamCapacity.set(userId, { ...capacity, availability: available });
    }
  }

  // Assignment History
  private recordAssignment(
    leadId: string,
    assignedTo: string,
    assignmentType: AssignmentHistory['assignmentType'],
    ruleName?: string,
    territoryId?: string
  ): void {
    this.assignmentHistory.push({
      leadId,
      assignedTo,
      assignedBy: 'system',
      assignmentDate: new Date(),
      ruleName,
      territoryId,
      assignmentType
    });
  }

  getAssignmentHistory(leadId?: string): AssignmentHistory[] {
    if (leadId) {
      return this.assignmentHistory.filter(history => history.leadId === leadId);
    }
    return [...this.assignmentHistory];
  }
}

export const assignmentService = new AssignmentService();