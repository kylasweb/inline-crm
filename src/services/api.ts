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
    if (endpoint.includes('/leads')) {
      return {
        success: true,
        data: mockLeadData(endpoint) as T
      };
    } else if (endpoint.includes('/accounts')) {
      return {
        success: true,
        data: mockAccountData(endpoint) as T
      };
    } else if (endpoint.includes('/opportunities')) {
      return {
        success: true,
        data: mockOpportunityData(endpoint) as T
      };
    } else if (endpoint.includes('/quotations')) {
      return {
        success: true,
        data: mockQuotationData(endpoint) as T
      };
    } else if (endpoint.includes('/dashboard')) {
      return {
        success: true,
        data: mockDashboardData() as T
      };
    } else if (endpoint.includes('/lead-config')) {
      return {
        success: true,
        data: mockLeadConfigData(endpoint) as T
      };
    }
    
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
  // Implementation remains the same...
  return {} as DashboardData;
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
