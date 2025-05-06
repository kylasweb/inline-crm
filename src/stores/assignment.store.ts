import { create } from 'zustand';
import { AssignmentRule, AssignmentHistory, TeamMemberCapacity } from '@/services/assignment/assignmentTypes';
import { assignmentService } from '@/services/assignment/assignmentService';
import { assignmentRuleEngine } from '@/services/assignment/assignmentRules';

interface AssignmentStore {
  rules: AssignmentRule[];
  history: AssignmentHistory[];
  teamCapacity: TeamMemberCapacity[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRules: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchTeamCapacity: () => Promise<void>;
  createRule: (rule: Omit<AssignmentRule, 'id'>) => Promise<void>;
  updateRule: (rule: AssignmentRule) => Promise<void>;
  deleteRule: (ruleId: string) => Promise<void>;
  toggleRuleStatus: (ruleId: string, isActive: boolean) => Promise<void>;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  rules: [],
  history: [],
  teamCapacity: [],
  isLoading: false,
  error: null,

  fetchRules: async () => {
    try {
      set({ isLoading: true, error: null });
      const activeRules = assignmentRuleEngine.getActiveRules();
      set({ rules: activeRules, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch rules', isLoading: false });
    }
  },

  fetchHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      const history = assignmentService.getAssignmentHistory();
      set({ history, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch history', isLoading: false });
    }
  },

  fetchTeamCapacity: async () => {
    try {
      set({ isLoading: true, error: null });
      // This would need to be implemented in assignmentService
      // const capacity = await assignmentService.getTeamCapacity();
      const capacity: TeamMemberCapacity[] = [];
      set({ teamCapacity: capacity, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch team capacity', isLoading: false });
    }
  },

  createRule: async (ruleData: Omit<AssignmentRule, 'id'>) => {
    try {
      set({ isLoading: true, error: null });
      const newRule: AssignmentRule = {
        ...ruleData,
        id: crypto.randomUUID(),
      };
      await assignmentRuleEngine.addRule(newRule);
      set(state => ({
        rules: [...state.rules, newRule],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create rule', isLoading: false });
    }
  },

  updateRule: async (rule: AssignmentRule) => {
    try {
      set({ isLoading: true, error: null });
      await assignmentRuleEngine.updateRule(rule.id, rule);
      set(state => ({
        rules: state.rules.map(r => r.id === rule.id ? rule : r),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update rule', isLoading: false });
    }
  },

  deleteRule: async (ruleId: string) => {
    try {
      set({ isLoading: true, error: null });
      // This would need to be implemented in assignmentRuleEngine
      // await assignmentRuleEngine.deleteRule(ruleId);
      set(state => ({
        rules: state.rules.filter(r => r.id !== ruleId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete rule', isLoading: false });
    }
  },

  toggleRuleStatus: async (ruleId: string, isActive: boolean) => {
    try {
      set({ isLoading: true, error: null });
      const rule = get().rules.find(r => r.id === ruleId);
      if (rule) {
        const updatedRule = { ...rule, isActive };
        await assignmentRuleEngine.updateRule(updatedRule.id, updatedRule);
        set(state => ({
          rules: state.rules.map(r => r.id === ruleId ? updatedRule : r),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to toggle rule status', isLoading: false });
    }
  }
}));