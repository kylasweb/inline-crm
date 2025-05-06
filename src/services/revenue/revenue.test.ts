import { generateForecast, analyzeOpportunity, analyzeProductPerformance, analyzeSalesCycle, calculateMetric, generateReport } from './revenueService';
import { validateData, performStatisticalAnalysis, analyzeTrend, generateReport as generateUtilReport } from './revenueUtils';
import { Opportunity, Product, SalesCycle, OpportunityStage, OpportunityStatus } from './revenueTypes';

describe('Revenue Service', () => {
  it('should generate a forecast', async () => {
    const opportunities: Opportunity[] = [
      {
        id: '1',
        name: 'Opportunity 1',
        description: 'Description 1',
        source: { type: 'direct' },
        accountId: '1',
        stage: OpportunityStage.QUALIFICATION,
        value: { amount: 1000, currency: 'USD' },
        probability: 0.5,
        expectedCloseDate: '2024-01-01',
        products: [],
        assignedTo: '1',
        status: OpportunityStatus.OPEN,
        priority: 'medium',
        metadata: {},
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        name: 'Opportunity 2',
        description: 'Description 2',
        source: { type: 'direct' },
        accountId: '2',
        stage: OpportunityStage.QUALIFICATION,
        value: { amount: 2000, currency: 'USD' },
        probability: 0.5,
        expectedCloseDate: '2024-01-01',
        products: [],
        assignedTo: '2',
        status: OpportunityStatus.OPEN,
        priority: 'medium',
        metadata: {},
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const forecast = await generateForecast(opportunities);
    expect(forecast).toBeDefined();
    expect(forecast.targetRevenue).toBe(3000);
  });

  it('should analyze an opportunity', () => {
    const opportunity: Opportunity = {
      id: '1',
      name: 'Opportunity 1',
      description: 'Description 1',
      source: { type: 'direct' },
      accountId: '1',
      stage: OpportunityStage.QUALIFICATION,
      value: { amount: 1000, currency: 'USD' },
      probability: 0.5,
      expectedCloseDate: '2024-01-01',
      products: [],
      assignedTo: '1',
      status: OpportunityStatus.OPEN,
      priority: 'medium',
      metadata: {},
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const analysis = analyzeOpportunity(opportunity);
    expect(analysis).toBeDefined();
    expect(analysis.stage).toBe(OpportunityStage.QUALIFICATION);
  });

  it('should analyze product performance', () => {
    const products: Product[] = [
      { id: '1', name: 'Product 1', price: 100, cost: 50, description: 'Description 1' },
      { id: '2', name: 'Product 2', price: 200, cost: 100, description: 'Description 2' },
    ];

    const analysis = analyzeProductPerformance(products);
    expect(analysis).toBeDefined();
    expect(analysis.totalRevenue).toBe(300);
  });

  it('should analyze sales cycle', () => {
    const salesCycles: SalesCycle[] = [
      { id: '1', name: 'Sales Cycle 1', stages: [], averageDuration: 30 },
      { id: '2', name: 'Sales Cycle 2', stages: [], averageDuration: 60 },
    ];

    const analysis = analyzeSalesCycle(salesCycles);
    expect(analysis).toBeDefined();
    expect(analysis.averageDuration).toBe(45);
  });

  it('should calculate a metric', () => {
    const data = { name: 'Metric 1', value: 100, description: 'Description 1' };
    const metric = calculateMetric(data);
    expect(metric).toBeDefined();
    expect(metric.name).toBe('Metric 1');
  });

  it('should generate a report', () => {
    const data = { name: 'Report 1', description: 'Description 1', data: {} };
    const report = generateReport(data);
    expect(report).toBeDefined();
    expect(report.name).toBe('Report 1');
  });
});

describe('Revenue Utils', () => {
  it('should validate data', () => {
    const data = {};
    const isValid = validateData(data);
    expect(isValid).toBe(true);
  });

  it('should perform statistical analysis', () => {
    const data = [1, 2, 3, 4, 5];
    const analysis = performStatisticalAnalysis(data);
    expect(analysis).toBeDefined();
    expect(analysis.mean).toBe(3);
  });

  it('should analyze trend', () => {
    const data = [1, 2, 3, 4, 5];
    const analysis = analyzeTrend(data);
    expect(analysis).toBeDefined();
    expect(analysis.trend).toBe('Increasing trend');
  });

  it('should generate a report', () => {
    const data = { title: 'Report 1', content: 'Content 1' };
    const report = generateUtilReport(data);
    expect(report).toBeDefined();
    expect(report.title).toBe('Report 1');
  });
});