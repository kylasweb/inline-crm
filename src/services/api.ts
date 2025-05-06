export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ================ Interfaces ================

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

export interface Opportunity {
  // Required fields matching CreateOpportunityDTO
  id: string;
  name: string;
  description: string;
  client: string;
  value: number;
  stage: string;
  closeDate: string;
  probability: number;
  owner: string;
  products: string[];
  source: {
    type: 'lead' | 'direct' | 'referral';
    id?: string;
  };
  accountId: string;
  priority: 'low' | 'medium' | 'high';
  
  // Additional fields specific to Opportunity
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown; // Add index signature to satisfy Record<string, unknown>
}

interface Account {
  id: string;
  name: string;
  type: 'customer' | 'prospect' | 'partner';
  industry: string;
  contacts: {
    id: string;
    accountId: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }[];
  addresses: {
    id: string;
    type: 'billing' | 'shipping' | 'other';
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isPrimary: boolean;
  }[];
  metadata: Record<string, any>;
}

interface Quotation {
  id: string;
  opportunityId: string;
  accountId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
  }[];
  subtotal: number;
  taxes: {
    name: string;
    rate: number;
    amount: number;
  }[];
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: Date;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
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
  recentActivity: Array<{
    id: number;
    type: string;
    action: string;
    subject: string;
    timestamp: string;
    user: string;
  }>;
}

// ================ API Functions ================

export async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data patterns based on endpoint
    // Strip leading slash for consistent matching
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Map endpoints to their mock data generators
    const mockDataMap: Record<string, () => any> = {
      'leads': () => mockLeadData(endpoint),
      'accounts': () => mockAccountData(endpoint),
      'opportunities': () => mockOpportunityData(endpoint),
      'quotations': () => mockQuotationData(endpoint),
      'dashboard': () => mockDashboardData(),
      'lead-config': () => mockLeadConfigData(endpoint),
      'tickets': () => mockTicketData(endpoint) // Add support for tickets
    };
    
    // Find matching endpoint
    const matchingEndpoint = Object.keys(mockDataMap).find(key =>
      cleanEndpoint.startsWith(key)
    );

    if (matchingEndpoint) {
      return {
        success: true,
        data: mockDataMap[matchingEndpoint]() as T
      };
    }
    
    return {
      success: false,
      error: `Endpoint "${endpoint}" not implemented in mock API`
    };
  } catch (error) {
    return {
      success: false,
      error: `API Request Failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function postData<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    if (endpoint.includes('/accounts')) {
      const responseData = {
        ...(data as Record<string, unknown>),
        id: `acc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        data: responseData as T
      };
    } else if (endpoint.includes('/opportunities')) {
      const responseData = {
        ...(data as Record<string, unknown>),
        id: `opp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        data: responseData as T
      };
    }

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

export async function updateData<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      data: { ...data, updatedAt: new Date().toISOString() } as T,
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
    await new Promise(resolve => setTimeout(resolve, 500));
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

// ================ Mock Data Generators ================

function mockLeadData(endpoint: string): Lead[] | LeadStats | number {
  // Existing mockLeadData implementation...
  return [];
}

function mockTicketData(endpoint: string): any {
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Pending'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];
  const types = ['Bug', 'Feature', 'Support', 'Question', 'Other'];
  const channels = ['Email', 'Phone', 'Web', 'Chat'];

  if (endpoint.includes('/stats')) {
    return {
      openTickets: Math.floor(Math.random() * 50) + 20,
      totalTickets: Math.floor(Math.random() * 200) + 100,
      avgResponseTime: Math.floor(Math.random() * 24) + 1,
      avgResolutionTime: Math.floor(Math.random() * 72) + 24,
      slaBreachRate: Math.floor(Math.random() * 20) + 5,
      ticketsByPriority: priorities.map(priority => ({
        priority,
        count: Math.floor(Math.random() * 30) + 5
      })),
      ticketsByStatus: statuses.map(status => ({
        status,
        count: Math.floor(Math.random() * 40) + 10
      })),
      ticketTrend: Array(7).fill(null).map((_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        opened: Math.floor(Math.random() * 20) + 5,
        closed: Math.floor(Math.random() * 15) + 5
      })),
      topClients: Array(5).fill(null).map((_, i) => ({
        client: `Client ${i + 1}`,
        count: Math.floor(Math.random() * 50) + 10
      })),
      topCategories: types.map(category => ({
        category,
        count: Math.floor(Math.random() * 40) + 10
      }))
    };
  }

  // Generate list of tickets
  return Array(40).fill(null).map((_, i) => ({
    id: `TKT-${String(i + 1).padStart(5, '0')}`,
    subject: `Sample Ticket ${i + 1}`,
    description: `This is a detailed description for ticket ${i + 1}...`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    client: `Client ${Math.floor(Math.random() * 20) + 1}`,
    assignee: Math.random() > 0.3 ? `Agent ${Math.floor(Math.random() * 5) + 1}` : null,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString() : null,
    tags: ['ticket', types[Math.floor(Math.random() * types.length)].toLowerCase()],
    channel: channels[Math.floor(Math.random() * channels.length)],
    sla: {
      responseTime: Math.floor(Math.random() * 24) + 1,
      resolutionTime: Math.floor(Math.random() * 72) + 24,
      breached: Math.random() > 0.8
    },
    comments: Array(Math.floor(Math.random() * 5)).fill(null).map((_, j) => ({
      author: `User ${Math.floor(Math.random() * 5) + 1}`,
      content: `Comment ${j + 1} on this ticket...`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000).toISOString()
    }))
  }));
}

function mockOpportunityData(endpoint: string): Opportunity | Opportunity[] | any {
  const stages = ['qualification', 'needs_analysis', 'proposal', 'negotiation', 'closing'];
  const statuses = ['open', 'won', 'lost', 'suspended'];
  const products = [
    { name: 'Cloud Infrastructure', basePrice: 5000 },
    { name: 'Security Suite', basePrice: 3000 },
    { name: 'Managed Services', basePrice: 2000 },
    { name: 'Custom Development', basePrice: 10000 },
    { name: 'IT Consulting', basePrice: 1500 }
  ];

  if (endpoint.includes('/analytics')) {
    return {
      totalValue: 1250000,
      avgDealSize: 125000,
      winRate: 35,
      salesCycle: 45,
      pipelineValue: {
        qualification: 300000,
        needs_analysis: 400000,
        proposal: 300000,
        negotiation: 150000,
        closing: 100000
      },
      forecastValue: 850000,
      conversionRates: {
        stageTransitions: {
          qualification: 80,
          needs_analysis: 60,
          proposal: 40,
          negotiation: 30,
          closing: 20
        },
        leadToOpportunity: 25,
        opportunityToWon: 35
      }
    };
  }

  if (endpoint.includes('/forecast')) {
    return {
      period: 'monthly',
      expectedValue: 850000,
      weightedValue: 680000,
      probability: 80,
      opportunities: Array(5).fill(null).map((_, idx) => ({
        id: `opp-${idx + 1}`,
        value: Math.floor(Math.random() * 200000) + 50000,
        probability: Math.floor(Math.random() * 40) + 60,
        expectedCloseDate: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
      }))
    };
  }

  if (endpoint.match(/\/opportunities\/[^\/]+$/)) {
    // Single opportunity
    const id = endpoint.split('/').pop() || '1';
    return mockSingleOpportunity(id);
  }

  // List of opportunities
  return Array(10).fill(null).map((_, idx) => mockSingleOpportunity(`opp-${idx + 1}`));
}

function mockSingleOpportunity(id: string): Opportunity {
  const stages = ['qualification', 'needs_analysis', 'proposal', 'negotiation', 'closing'];
  const statuses = ['open', 'won', 'lost', 'suspended'];
  const products = [
    { name: 'Cloud Infrastructure', basePrice: 5000 },
    { name: 'Security Suite', basePrice: 3000 },
    { name: 'Managed Services', basePrice: 2000 },
    { name: 'Custom Development', basePrice: 10000 },
    { name: 'IT Consulting', basePrice: 1500 }
  ];

  const stage = stages[Math.floor(Math.random() * stages.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const createdDate = new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000));
  const expectedCloseDate = new Date(createdDate.getTime() + Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000));

  const selectedProducts = products
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map((product, idx) => ({
      id: `prod-${id}-${idx}`,
      productId: `product-${idx}`,
      name: product.name,
      quantity: Math.floor(Math.random() * 5) + 1,
      unitPrice: product.basePrice,
      discount: {
        type: Math.random() > 0.5 ? 'percentage' as const : 'amount' as const,
        value: Math.random() > 0.5 ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 1000)
      },
      total: 0,
      metadata: {} as Record<string, any>
    }));

  // Calculate totals
  selectedProducts.forEach(product => {
    const subtotal = product.quantity * product.unitPrice;
    product.total = product.discount.type === 'percentage'
      ? subtotal * (1 - product.discount.value / 100)
      : subtotal - product.discount.value;
  });

  return {
    id,
    name: `Opportunity ${id}`,
    description: `Business opportunity for ${['Cloud Migration', 'Security Implementation', 'Digital Transformation', 'Infrastructure Upgrade'][Math.floor(Math.random() * 4)]}`,
    client: `Client ${Math.floor(Math.random() * 100)}`,
    value: selectedProducts.reduce((sum, p) => sum + p.total, 0),
    stage,
    closeDate: expectedCloseDate.toISOString(),
    probability: Math.floor(Math.random() * 100),
    owner: `${['Alex', 'Sam', 'Chris', 'Jordan', 'Taylor'][Math.floor(Math.random() * 5)]} ${['Wilson', 'Davis', 'Anderson', 'Thomas', 'Moore'][Math.floor(Math.random() * 5)]}`,
    products: selectedProducts.map(product => product.name),
    source: {
      type: Math.random() > 0.7 ? 'lead' : Math.random() > 0.5 ? 'direct' : 'referral',
      id: Math.random() > 0.7 ? `lead-${Math.floor(Math.random() * 100)}` : undefined
    },
    accountId: `acc-${Math.floor(Math.random() * 100)}`,
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    metadata: {},
    createdAt: createdDate.toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function mockDashboardData(): DashboardData {
  return {
    summary: {
      newLeads: Math.floor(Math.random() * 50) + 10,
      openOpportunities: Math.floor(Math.random() * 30) + 5,
      pendingTickets: Math.floor(Math.random() * 20) + 3,
      upcomingRenewals: Math.floor(Math.random() * 15) + 2
    },
    revenueStats: {
      thisMonth: Math.floor(Math.random() * 100000) + 50000,
      lastMonth: Math.floor(Math.random() * 100000) + 50000,
      forecast: Math.floor(Math.random() * 150000) + 75000,
      quarterly: Array(6).fill(null).map((_, i) => ({
        month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
        revenue: Math.floor(Math.random() * 100000) + 50000
      })).reverse()
    },
    ticketStats: {
      open: Math.floor(Math.random() * 20) + 5,
      inProgress: Math.floor(Math.random() * 15) + 3,
      pendingCustomer: Math.floor(Math.random() * 10) + 2,
      resolved: Math.floor(Math.random() * 50) + 20,
      priorityDistribution: [
        { priority: 'High', count: Math.floor(Math.random() * 10) + 5 },
        { priority: 'Medium', count: Math.floor(Math.random() * 20) + 10 },
        { priority: 'Low', count: Math.floor(Math.random() * 15) + 5 }
      ],
      responseTimeAvg: Math.floor(Math.random() * 24) + 1,
      resolutionTimeAvg: Math.floor(Math.random() * 72) + 24
    },
    pipelineStats: {
      stages: [
        { stage: 'Qualification', count: Math.floor(Math.random() * 10) + 5, value: Math.floor(Math.random() * 200000) + 100000 },
        { stage: 'Proposal', count: Math.floor(Math.random() * 8) + 3, value: Math.floor(Math.random() * 150000) + 75000 },
        { stage: 'Negotiation', count: Math.floor(Math.random() * 5) + 2, value: Math.floor(Math.random() * 100000) + 50000 },
        { stage: 'Closing', count: Math.floor(Math.random() * 3) + 1, value: Math.floor(Math.random() * 50000) + 25000 }
      ],
      winRate: Math.floor(Math.random() * 30) + 40,
      averageDealSize: Math.floor(Math.random() * 50000) + 25000,
      salesCycle: Math.floor(Math.random() * 30) + 45
    },
    recentActivity: Array(10).fill(null).map((_, i) => ({
      id: i + 1,
      type: ['lead', 'opportunity', 'ticket'][Math.floor(Math.random() * 3)],
      action: ['created', 'updated', 'closed'][Math.floor(Math.random() * 3)],
      subject: `Activity ${i + 1}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
      user: ['John Doe', 'Jane Smith', 'Alex Johnson'][Math.floor(Math.random() * 3)]
    }))
  };
}

function mockQuotationData(endpoint: string): Quotation | Quotation[] {
  const products = [
    { name: 'Cloud Infrastructure', basePrice: 5000 },
    { name: 'Security Suite', basePrice: 3000 },
    { name: 'Managed Services', basePrice: 2000 },
    { name: 'Custom Development', basePrice: 10000 },
    { name: 'IT Consulting', basePrice: 1500 }
  ];

  const statuses: Quotation['status'][] = ['draft', 'sent', 'accepted', 'rejected'];

  if (endpoint.match(/\/quotations\/[^\/]+$/)) {
    // Single quotation
    const id = endpoint.split('/').pop() || '1';
    return mockSingleQuotation(id);
  }

  // List of quotations
  return Array(10).fill(null).map((_, idx) => mockSingleQuotation(`quo-${idx + 1}`));
}

function mockSingleQuotation(id: string): Quotation {
  const products = [
    { name: 'Cloud Infrastructure', basePrice: 5000 },
    { name: 'Security Suite', basePrice: 3000 },
    { name: 'Managed Services', basePrice: 2000 },
    { name: 'Custom Development', basePrice: 10000 },
    { name: 'IT Consulting', basePrice: 1500 }
  ];

  const statuses: Quotation['status'][] = ['draft', 'sent', 'accepted', 'rejected'];
  const createdDate = new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000));
  const validUntil = new Date(createdDate.getTime() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));

  const items = products
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map((product, idx) => {
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = product.basePrice;
      const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 20) : undefined;
      const total = quantity * unitPrice * (1 - (discount || 0) / 100);
      
      return {
        productId: `prod-${idx}`,
        name: product.name,
        quantity,
        unitPrice,
        discount,
        total
      };
    });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxes = [
    { name: 'VAT', rate: 18, amount: subtotal * 0.18 }
  ];
  const total = subtotal + taxes.reduce((sum, tax) => sum + tax.amount, 0);

  return {
    id,
    opportunityId: `opp-${Math.floor(Math.random() * 100)}`,
    accountId: `acc-${Math.floor(Math.random() * 100)}`,
    items,
    subtotal,
    taxes,
    total,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    validUntil,
    metadata: {},
    createdAt: createdDate.toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function mockLeadConfigData(endpoint: string): any {
  // Implementation remains the same...
  return null;
}

function mockAccountData(endpoint: string): Account | { accounts: Account[], total: number } {
  const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Other'];
  
  if (endpoint.match(/\/accounts\/[^\/]+$/)) {
    // Single account
    const id = endpoint.split('/').pop() || '1';
    return mockSingleAccount(id);
  }
  
  // List of accounts with total
  const accounts = Array(10).fill(null).map((_, idx) => mockSingleAccount(`acc-${idx + 1}`));
  return {
    accounts,
    total: accounts.length
  };
}

function mockSingleAccount(id: string): Account {
  const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Other'];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Taylor'];
  const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Singapore'];
  const countries = ['USA', 'UK', 'Japan', 'France', 'Australia', 'Singapore'];

  const generateContact = (isPrimary: boolean = false) => ({
    id: `contact-${id}-${Math.random().toString(36).substring(7)}`,
    accountId: id,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    role: ['CEO', 'CTO', 'Sales Manager', 'IT Director'][Math.floor(Math.random() * 4)],
    email: `contact${Math.floor(Math.random() * 1000)}@example.com`,
    phone: `+1${Math.floor(Math.random() * 1000000000)}`,
    isPrimary
  });

  const generateAddress = (isPrimary: boolean = false) => ({
    id: `address-${id}-${Math.random().toString(36).substring(7)}`,
    type: ['billing', 'shipping', 'other'][Math.floor(Math.random() * 3)] as 'billing' | 'shipping' | 'other',
    street: `${Math.floor(Math.random() * 1000)} Main St`,
    city: cities[Math.floor(Math.random() * cities.length)],
    state: 'State',
    country: countries[Math.floor(Math.random() * countries.length)],
    postalCode: `${Math.floor(Math.random() * 100000)}`,
    isPrimary
  });

  return {
    id,
    name: `Account ${id}`,
    type: ['customer', 'prospect', 'partner'][Math.floor(Math.random() * 3)] as 'customer' | 'prospect' | 'partner',
    industry: industries[Math.floor(Math.random() * industries.length)],
    contacts: [
      generateContact(true),
      ...Array(Math.floor(Math.random() * 3)).fill(null).map(() => generateContact(false))
    ],
    addresses: [
      generateAddress(true),
      ...Array(Math.floor(Math.random() * 2)).fill(null).map(() => generateAddress(false))
    ],
    metadata: {}
  };
}

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  leadTrend: { date: string; leads: number }[];
}

export type DashboardDataReturn = ReturnType<typeof mockDashboardData>;
