/**
 * Base API service for making HTTP requests
 */
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

interface LeadStats {
  totalLeads: number;
  newLeadsToday: number;
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  conversionRate: number;
  averageResponseTime: number;
}

// Mock data generators
function mockLeadData(endpoint: string): Lead[] | LeadStats {
  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'];
  const sources = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Trade Show', 'Email Campaign'];
  const companies = ['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Wayne Enterprises', 'Stark Industries'];
  
  interface MockLeadStats {
    totalLeads: number;
    newLeadsToday: number;
    leadsBySource: { source: string; count: number }[];
    leadsByStatus: { status: string; count: number }[];
    conversionRate: number;
    averageResponseTime: number;
  }

  if (endpoint.includes('/leads/stats')) {
    const result: MockLeadStats = {
      totalLeads: 156,
      newLeadsToday: 12,
      leadsBySource: [
        { source: 'Website', count: 45 },
        { source: 'Referral', count: 32 },
        { source: 'LinkedIn', count: 28 },
        { source: 'Cold Call', count: 15 },
        { source: 'Trade Show', count: 21 },
        { source: 'Email Campaign', count: 15 }
      ],
      leadsByStatus: [
        { status: 'New', count: 35 },
        { status: 'Contacted', count: 42 },
        { status: 'Qualified', count: 38 },
        { status: 'Proposal', count: 25 },
        { status: 'Negotiation', count: 16 }
      ],
      conversionRate: 24, // percentage
      averageResponseTime: 3.5, // hours
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
      assignedTo: `${['Alex', 'Sam', 'Chris', 'Jordan', 'Taylor'][Math.floor(Math.random() * 5)]} ${['Wilson', 'Davis', 'Anderson', 'Thomas, Moore'][Math.floor(Math.random() * 5)]}`,
      lastContact: Math.random() > 0.3 ? new Date(randomDate.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString() : null,
      notes: Math.random() > 0.5 ? `Interested in our ${['cloud services', 'security solutions', 'infrastructure upgrades', 'software development', 'managed services'][Math.floor(Math.random() * 5)]} offerings.` : '',
    };
  });
  
  return leads;
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
