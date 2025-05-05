/**
 * Base API service for making HTTP requests
 */
import { LeadStats } from './leadService';

const API_BASE_URL = 'https://api.example.com'; // Replace with your API URL in production

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data patterns based on endpoint
    if (endpoint.includes('/leads')) {
      return {
        success: true,
        data: mockLeadData(endpoint) as T
      };
    } else if (endpoint.includes('/dashboard')) {
      return {
        success: true,
        data: mockDashboardData(endpoint) as T
      };
    } else if (endpoint.includes('/lead-config')) {
      return {
        success: true,
        data: mockLeadConfigData(endpoint) as T
      };
    }
    
    // Default response
    return {
      success: false,
      error: 'Endpoint not implemented in mock API'
    };
  } catch (error) {
    return {
      success: false,
      error: `API Request Failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function postData<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Mock form validation
    if (endpoint.includes('/validate')) {
      return {
        success: true,
        data: mockValidateFormData(data) as T
      };
    }
    
    // Mock form submission
    if (endpoint.includes('/submit')) {
      return {
        success: true,
        data: mockSubmitForm(data) as T
      };
    }
    
    // Mock successful response
    return {
      success: true,
      data: { ...(data as Record<string, unknown>), id: `mock-${Date.now()}`, createdAt: new Date().toISOString() } as T,
      message: 'Data saved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: `API Request Failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function updateData<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock successful response
    return {
      success: true,
      data: { ...(data as Record<string, unknown>), updatedAt: new Date().toISOString() } as T,
      message: 'Data updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: `API Request Failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function deleteData(endpoint: string): Promise<ApiResponse<void>> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful response
    return {
      success: true,
      message: 'Resource deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: `API Request Failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// Interfaces
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  createdAt: string;
  status: string;
  source: string;
  score: number;
  assignedTo: string;
  lastContact: string | null;
  notes: string;
}

interface DashboardData {
  summary: {
    newLeads: number;
    openOpportunities: number;
    pendingTickets: number;
    upcomingRenewals: number;
  };
  revenueStats: {
    thisMonth: number;
    lastMonth: number;
    forecast: number;
    quarterly: { month: string; revenue: number }[];
  };
  ticketStats: {
    open: number;
    inProgress: number;
    pendingCustomer: number;
    resolved: number;
    priorityDistribution: { priority: string; count: number }[];
    responseTimeAvg: number;
    resolutionTimeAvg: number;
  };
  pipelineStats: {
    stages: { stage: string; count: number; value: number }[];
    winRate: number;
    averageDealSize: number;
    salesCycle: number;
  };
  recentActivity: { id: number; type: string; action: string; subject: string; timestamp: string; user: string }[];
}

// Mock data generators
function mockLeadData(endpoint: string): Lead[] | LeadStats | number {
  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'];
  const sources = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Trade Show', 'Email Campaign'];
  const companies = ['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Wayne Enterprises', 'Stark Industries'];
  
  interface LeadStats {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    conversionRate: number;
    leadsBySource: { source: string; count: number }[];
    leadsByStatus: { status: string; count: number }[];
    leadTrend: { date: string; leads: number }[];
  }

  if (endpoint.includes('/score')) {
    return Math.floor(Math.random() * 100);
  }

  if (endpoint.includes('/stats')) {
    const result: LeadStats = {
      totalLeads: 156,
      newLeads: 24,
      qualifiedLeads: 38,
      conversionRate: 24,
      leadsBySource: sources.map(source => ({
        source,
        count: Math.floor(Math.random() * 50) + 10
      })),
      leadsByStatus: statuses.map(status => ({
        status,
        count: Math.floor(Math.random() * 40) + 5
      })),
      leadTrend: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          leads: Math.floor(Math.random() * 10) + 1
        };
      })
    };
    return result;
  }
  
  const leads: Lead[] = Array(25).fill(null).map((_, idx) => {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    return {
      id: `lead-${idx + 1}`,
      name: `${['John', 'Jane', 'Mike', 'Sara', 'David', 'Lisa'][Math.floor(Math.random() * 6)]} ${['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Miller'][Math.floor(Math.random() * 6)]}`,
      company,
      email: `contact${idx + 1}@${company.toLowerCase().replace(/\s/g, '')}.com`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      createdAt: randomDate.toISOString(),
      status,
      source,
      score: Math.floor(Math.random() * 100),
      assignedTo: `${['Alex', 'Sam', 'Chris', 'Jordan', 'Taylor'][Math.floor(Math.random() * 5)]} ${['Wilson', 'Davis', 'Anderson', 'Thomas', 'Moore'][Math.floor(Math.random() * 5)]}`,
      lastContact: Math.random() > 0.3 ? new Date(randomDate.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString() : null,
      notes: Math.random() > 0.5 ? `Interested in our ${['cloud services', 'security solutions', 'infrastructure upgrades', 'software development', 'managed services'][Math.floor(Math.random() * 5)]} offerings.` : '',
    };
  });
  
  return leads;
}

function mockLeadConfigData(endpoint: string): any {
  // Mock form configurations
  if (endpoint.includes('/forms')) {
    if (endpoint.includes('/forms/')) {
      // Single form configuration
      return mockFormDefinition();
    }
    // List of form configurations
    return Array(3).fill(null).map((_, i) => mockFormDefinition(i));
  }

  // Mock scoring rules
  if (endpoint.includes('/scoring-rules')) {
    if (endpoint.includes('/scoring-rules/')) {
      // Single scoring rule
      return mockScoringRule();
    }
    // List of scoring rules
    return Array(5).fill(null).map((_, i) => mockScoringRule(i));
  }

  // Mock assignment rules
  if (endpoint.includes('/assignment-rules')) {
    if (endpoint.includes('/assignment-rules/')) {
      // Single assignment rule
      return mockAssignmentRule();
    }
    // List of assignment rules
    return Array(3).fill(null).map((_, i) => mockAssignmentRule(i));
  }

  return null;
}

function mockFormDefinition(index = 0): any {
  return {
    id: `form-${index + 1}`,
    sections: [
      {
        id: `section-${index}-1`,
        title: 'Contact Information',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
            validation: [
              { type: 'required', message: 'Name is required' }
            ]
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            required: true,
            validation: [
              { type: 'required', message: 'Email is required' },
              { type: 'pattern', value: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email format' }
            ]
          },
          {
            id: 'phone',
            type: 'phone',
            label: 'Phone Number',
            required: false
          }
        ]
      },
      {
        id: `section-${index}-2`,
        title: 'Company Details',
        fields: [
          {
            id: 'company',
            type: 'text',
            label: 'Company Name',
            required: true
          },
          {
            id: 'industry',
            type: 'select',
            label: 'Industry',
            required: true,
            options: [
              { label: 'Technology', value: 'tech' },
              { label: 'Healthcare', value: 'health' },
              { label: 'Finance', value: 'finance' },
              { label: 'Manufacturing', value: 'manufacturing' },
              { label: 'Other', value: 'other' }
            ]
          }
        ]
      }
    ],
    layout: 'single',
    theme: {
      variant: 'default'
    },
    validationRules: []
  };
}

function mockScoringRule(index = 0): any {
  return {
    id: `rule-${index + 1}`,
    field: ['industry', 'company_size', 'budget', 'timeline'][index % 4],
    operator: ['equals', 'greaterThan', 'contains'][index % 3],
    value: ['tech', '100', '10000', 'immediate'][index % 4],
    score: (index + 1) * 10,
    priority: index + 1
  };
}

function mockAssignmentRule(index = 0): any {
  return {
    id: `assignment-${index + 1}`,
    conditions: [
      {
        field: ['score', 'industry', 'source'][index % 3],
        operator: ['greaterThan', 'equals', 'contains'][index % 3],
        value: ['50', 'tech', 'website'][index % 3]
      }
    ],
    assignTo: `${['Alex', 'Sam', 'Chris', 'Jordan', 'Taylor'][index % 5]} ${['Wilson', 'Davis', 'Anderson', 'Thomas', 'Moore'][index % 5]}`,
    priority: index + 1
  };
}

function mockValidateFormData(data: any): any {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  // Simple validation example
  if (data.email && !data.email.includes('@')) {
    errors.email = ['Invalid email format'];
    isValid = false;
  }

  if (!data.name) {
    errors.name = ['Name is required'];
    isValid = false;
  }

  return {
    isValid,
    errors
  };
}

function mockSubmitForm(data: any): Lead {
  return {
    id: `lead-${Date.now()}`,
    name: data.name || 'Unknown',
    company: data.company || 'Unknown',
    email: data.email || '',
    phone: data.phone || '',
    createdAt: new Date().toISOString(),
    status: 'New',
    source: 'Web Form',
    score: Math.floor(Math.random() * 100),
    assignedTo: '',
    lastContact: null,
    notes: data.notes || ''
  };
}

function mockDashboardData(endpoint: string): DashboardData {
  return {
    summary: {
      newLeads: 24,
      openOpportunities: 18,
      pendingTickets: 12,
      upcomingRenewals: 5
    },
    revenueStats: {
      thisMonth: 285000,
      lastMonth: 254000,
      forecast: 320000,
      quarterly: [
        { month: 'Jan', revenue: 240000 },
        { month: 'Feb', revenue: 254000 },
        { month: 'Mar', revenue: 285000 },
        { month: 'Apr', revenue: 320000 }, // forecast
      ]
    },
    ticketStats: {
      open: 36,
      inProgress: 28,
      pendingCustomer: 15,
      resolved: 142,
      priorityDistribution: [
        { priority: 'Critical', count: 5 },
        { priority: 'High', count: 12 },
        { priority: 'Medium', count: 38 },
        { priority: 'Low', count: 24 }
      ],
      responseTimeAvg: 2.4, // hours
      resolutionTimeAvg: 18.6 // hours
    },
    pipelineStats: {
      stages: [
        { stage: 'Qualification', count: 24, value: 450000 },
        { stage: 'Solution Design', count: 18, value: 820000 },
        { stage: 'Proposal', count: 12, value: 640000 },
        { stage: 'Negotiation', count: 7, value: 380000 },
        { stage: 'Closed Won', count: 5, value: 240000 }
      ],
      winRate: 32, // percentage
      averageDealSize: 78500,
      salesCycle: 68 // days
    },
    recentActivity: [
      { id: 1, type: 'lead', action: 'created', subject: 'New lead from Acme Inc.', timestamp: new Date(Date.now() - 25 * 60000).toISOString(), user: 'John Smith' },
      { id: 2, type: 'opportunity', action: 'updated', subject: 'Updated proposal for CloudTech Solution', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), user: 'Sarah Wilson' },
      { id: 3, type: 'ticket', action: 'resolved', subject: 'Network connectivity issue', timestamp: new Date(Date.now() - 180 * 60000).toISOString(), user: 'Tech Support' },
      { id: 4, type: 'quote', action: 'approved', subject: 'Security system upgrade quote', timestamp: new Date(Date.now() - 240 * 60000).toISOString(), user: 'David Johnson' },
      { id: 5, type: 'lead', action: 'converted', subject: 'Lead converted to opportunity', timestamp: new Date(Date.now() - 300 * 60000).toISOString(), user: 'John Smith' }
    ]
  };
}

export type DashboardDataReturn = ReturnType<typeof mockDashboardData>
