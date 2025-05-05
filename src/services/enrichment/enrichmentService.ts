import { Lead } from '../api';
import { enrichmentProviders } from './enrichmentProviders';
import { 
  LeadEnrichmentData, 
  EnrichmentStatus,
  EnrichmentResult,
  CompanyEnrichment,
  ContactEnrichment,
  SocialEnrichment,
  TechnologyEnrichment
} from './enrichmentTypes';

class EnrichmentService {
  private enrichmentCache: Map<string, LeadEnrichmentData> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Initialize enrichment process for a lead
  async enrichLead(lead: Lead): Promise<LeadEnrichmentData> {
    // Check cache first
    const cachedData = this.enrichmentCache.get(lead.id);
    if (this.isValidCacheData(cachedData)) {
      return cachedData;
    }

    // Create initial enrichment status
    const status: EnrichmentStatus = {
      leadId: lead.id,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      attempts: 0,
      providers: []
    };

    try {
      // Fetch enrichment data from all providers
      const enrichmentResults = await enrichmentProviders.enrichLead(lead);
      
      // Process and combine results
      const enrichedData = this.processEnrichmentResults(enrichmentResults);
      
      // Update status
      status.status = 'completed';
      status.completedAt = new Date().toISOString();
      status.providers = enrichmentResults.map(result => ({
        name: result.source,
        status: result.success ? 'success' : 'failed',
        timestamp: result.enrichedAt
      }));

      // Combine data with status
      const finalData: LeadEnrichmentData = {
        ...enrichedData,
        status
      };

      // Cache the results
      this.enrichmentCache.set(lead.id, finalData);

      return finalData;
    } catch (error) {
      // Handle enrichment failure
      status.status = 'failed';
      status.completedAt = new Date().toISOString();
      status.error = error instanceof Error ? error.message : 'Unknown error';

      const failedEnrichment: LeadEnrichmentData = { status };
      this.enrichmentCache.set(lead.id, failedEnrichment);
      
      return failedEnrichment;
    }
  }

  // Process and combine results from different providers
  private processEnrichmentResults(results: EnrichmentResult[]): Partial<LeadEnrichmentData> {
    const enrichedData: Partial<LeadEnrichmentData> = {};

    for (const result of results) {
      if (!result.success) continue;

      switch (result.source) {
        case 'company-data':
          enrichedData.company = result.data as CompanyEnrichment;
          break;
        case 'contact-info':
          enrichedData.contact = result.data as ContactEnrichment;
          break;
        case 'social-media':
          enrichedData.social = result.data as SocialEnrichment;
          break;
        case 'tech-stack':
          enrichedData.technology = result.data as TechnologyEnrichment;
          break;
      }
    }

    return enrichedData;
  }

  // Validate cache data
  private isValidCacheData(data?: LeadEnrichmentData): boolean {
    if (!data || !data.status.completedAt) return false;
    
    const completedAt = new Date(data.status.completedAt).getTime();
    const now = Date.now();
    
    return now - completedAt < this.CACHE_DURATION;
  }

  // Force refresh enrichment data
  async refreshEnrichment(lead: Lead): Promise<LeadEnrichmentData> {
    this.enrichmentCache.delete(lead.id);
    return this.enrichLead(lead);
  }

  // Get enrichment status
  async getEnrichmentStatus(leadId: string): Promise<EnrichmentStatus | null> {
    const cachedData = this.enrichmentCache.get(leadId);
    return cachedData?.status || null;
  }

  // Clear cached enrichment data
  clearEnrichmentCache(leadId?: string): void {
    if (leadId) {
      this.enrichmentCache.delete(leadId);
    } else {
      this.enrichmentCache.clear();
    }
  }

  // Validate enrichment data
  validateEnrichmentData(data: LeadEnrichmentData): boolean {
    // Company validation
    if (data.company) {
      if (!data.company.name || !data.company.domain || !data.company.industry) {
        return false;
      }
    }

    // Contact validation
    if (data.contact) {
      if (!data.contact.email || !data.contact.phone) {
        return false;
      }
    }

    // At least one type of enrichment data should be present
    return !!(data.company || data.contact || data.social || data.technology);
  }
}

// Export singleton instance
export const enrichmentService = new EnrichmentService();