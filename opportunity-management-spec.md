# Opportunity Management Module Technical Specification

## Overview

The Opportunity Management module is a core component of the CRM system that manages sales opportunities from creation to closure. It integrates closely with Lead Management, Account Management, and Quotation Management modules.

## Technical Architecture

### Data Models

#### Core Models

```typescript
interface Opportunity {
  id: string;
  name: string;
  description: string;
  source: {
    type: 'lead' | 'direct' | 'referral';
    id?: string; // Reference to lead/referral source
  };
  accountId: string;
  stage: OpportunityStage;
  value: {
    amount: number;
    currency: string;
    recurringValue?: number;
    recurringPeriod?: 'monthly' | 'yearly';
  };
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  products: OpportunityProduct[];
  assignedTo: string;
  status: OpportunityStatus;
  priority: 'low' | 'medium' | 'high';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface OpportunityProduct {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: {
    type: 'percentage' | 'amount';
    value: number;
  };
  total: number;
  metadata: Record<string, any>;
}

enum OpportunityStage {
  QUALIFICATION = 'qualification',
  NEEDS_ANALYSIS = 'needs_analysis',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSING = 'closing'
}

enum OpportunityStatus {
  OPEN = 'open',
  WON = 'won',
  LOST = 'lost',
  SUSPENDED = 'suspended'
}
```

#### Analytics Models

```typescript
interface OpportunityAnalytics {
  totalValue: number;
  avgDealSize: number;
  winRate: number;
  salesCycle: number;
  pipelineValue: Record<OpportunityStage, number>;
  forecastValue: number;
  conversionRates: {
    stageTransitions: Record<OpportunityStage, number>;
    leadToOpportunity: number;
    opportunityToWon: number;
  };
}

interface OpportunityForecast {
  period: 'monthly' | 'quarterly' | 'yearly';
  expectedValue: number;
  weightedValue: number;
  probability: number;
  opportunities: Array<{
    id: string;
    value: number;
    probability: number;
    expectedCloseDate: Date;
  }>;
}
```

### Service Layer

#### Opportunity Service

```typescript
interface OpportunityService {
  // Core CRUD operations
  getAll(filters?: OpportunityFilters): Promise<ServiceResponse<Opportunity[]>>;
  getById(id: string): Promise<ServiceResponse<Opportunity>>;
  create(data: CreateOpportunityDTO): Promise<ServiceResponse<Opportunity>>;
  update(id: string, data: UpdateOpportunityDTO): Promise<ServiceResponse<Opportunity>>;
  delete(id: string): Promise<ServiceResponse<void>>;
  
  // Specialized operations
  convertLeadToOpportunity(leadId: string): Promise<ServiceResponse<Opportunity>>;
  updateStage(id: string, stage: OpportunityStage): Promise<ServiceResponse<Opportunity>>;
  markAsWon(id: string, closeData: CloseOpportunityDTO): Promise<ServiceResponse<Opportunity>>;
  markAsLost(id: string, reason: string): Promise<ServiceResponse<Opportunity>>;
  reassign(id: string, assigneeId: string): Promise<ServiceResponse<Opportunity>>;
  
  // Analytics operations
  getAnalytics(filters?: AnalyticsFilters): Promise<ServiceResponse<OpportunityAnalytics>>;
  getForecast(period: string): Promise<ServiceResponse<OpportunityForecast>>;
}
```

#### Integration Services

```typescript
interface OpportunityIntegrationService {
  // Lead integration
  getRelatedLead(opportunityId: string): Promise<ServiceResponse<Lead>>;
  linkLeadToOpportunity(leadId: string, opportunityId: string): Promise<ServiceResponse<void>>;
  
  // Account integration
  getRelatedAccount(opportunityId: string): Promise<ServiceResponse<Account>>;
  updateAccountOpportunities(accountId: string): Promise<ServiceResponse<void>>;
  
  // Quotation integration
  getRelatedQuotations(opportunityId: string): Promise<ServiceResponse<Quotation[]>>;
  createQuotationFromOpportunity(opportunityId: string): Promise<ServiceResponse<Quotation>>;
}
```

### UI Components

#### Pages

```typescript
// Main Opportunity Page
interface OpportunitiesPageProps {
  filters?: OpportunityFilters;
  view?: 'list' | 'board' | 'analytics';
}

// Detail Page
interface OpportunityDetailPageProps {
  id: string;
  mode?: 'view' | 'edit';
}
```

#### Components

1. **OpportunityList**
   - Filterable list view of opportunities
   - Sortable columns
   - Bulk actions
   - Quick actions per row

2. **OpportunityBoard**
   - Kanban-style board view
   - Drag-and-drop stage management
   - Quick cards with key information
   - Filtering and search

3. **OpportunityDetail**
   - Complete opportunity information
   - Stage progression timeline
   - Related entities (leads, accounts, quotations)
   - Activity history

4. **OpportunityForm**
   - Create/Edit opportunity
   - Dynamic product selection
   - Validation rules
   - Auto-save functionality

5. **OpportunityAnalytics**
   - Pipeline visualization
   - Win/Loss analysis
   - Forecast charts
   - Performance metrics

### State Management

```typescript
interface OpportunityState {
  opportunities: Record<string, Opportunity>;
  filters: OpportunityFilters;
  sorting: SortConfig;
  selectedIds: string[];
  analytics: OpportunityAnalytics;
  loading: boolean;
  error?: string;
}

// React Query Hooks
const useOpportunities = (filters?: OpportunityFilters) => {
  return useQuery(['opportunities', filters], () => 
    opportunityService.getAll(filters));
};

const useOpportunityMutation = () => {
  return useMutation((data: CreateOpportunityDTO) => 
    opportunityService.create(data));
};
```

### API Routes

```typescript
// Opportunity endpoints
POST   /api/v1/opportunities
GET    /api/v1/opportunities
GET    /api/v1/opportunities/:id
PUT    /api/v1/opportunities/:id
DELETE /api/v1/opportunities/:id

// Stage management
PUT    /api/v1/opportunities/:id/stage
POST   /api/v1/opportunities/:id/won
POST   /api/v1/opportunities/:id/lost

// Integrations
GET    /api/v1/opportunities/:id/lead
GET    /api/v1/opportunities/:id/account
GET    /api/v1/opportunities/:id/quotations

// Analytics
GET    /api/v1/opportunities/analytics
GET    /api/v1/opportunities/forecast
```

### Integration Points

1. **Lead Management**
   - Lead conversion process
   - Opportunity source tracking
   - Lead-to-opportunity analytics

2. **Account Management**
   - Account association
   - Contact relationships
   - Account opportunity history

3. **Quotation Management**
   - Quote generation from opportunity
   - Quote status syncing
   - Value calculations

4. **Analytics Engine**
   - Pipeline analytics
   - Conversion metrics
   - Revenue forecasting

### Events and Workflows

```typescript
interface OpportunityEvent {
  type: OpportunityEventType;
  opportunityId: string;
  data: any;
  timestamp: Date;
  userId: string;
}

enum OpportunityEventType {
  CREATED = 'created',
  UPDATED = 'updated',
  STAGE_CHANGED = 'stage_changed',
  WON = 'won',
  LOST = 'lost',
  ASSIGNED = 'assigned',
  PRODUCT_ADDED = 'product_added',
  PRODUCT_REMOVED = 'product_removed'
}
```

### Analytics Requirements

1. **Pipeline Analytics**
   - Stage-wise value distribution
   - Conversion rates between stages
   - Average deal size
   - Win/loss ratios

2. **Performance Metrics**
   - Sales cycle duration
   - Win rate by product/service
   - Revenue by source
   - Team performance

3. **Forecasting**
   - Weighted pipeline value
   - Expected close dates
   - Probability adjustments
   - Historical trends

### Security Considerations

1. **Access Control**
   - Role-based access to opportunities
   - Field-level security
   - Action permissions

2. **Data Validation**
   - Input sanitization
   - Business rule validation
   - Data consistency checks

3. **Audit Trail**
   - Change tracking
   - User action logging
   - Critical field history

### Implementation Phases

1. **Phase 1: Core Features**
   - Basic CRUD operations
   - Lead integration
   - Simple pipeline view

2. **Phase 2: Enhanced Features**
   - Advanced pipeline management
   - Product configuration
   - Basic analytics

3. **Phase 3: Advanced Features**
   - Complex analytics
   - Forecasting
   - Automation rules

4. **Phase 4: Optimization**
   - Performance improvements
   - Advanced integrations
   - Custom workflows

## Next Steps

1. Review and approve technical specification
2. Set up core data models and database schema
3. Implement basic service layer
4. Create UI components
5. Integrate with Lead Management
6. Add analytics and reporting
7. Test and validate integrations