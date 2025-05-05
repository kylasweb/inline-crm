import { 
  EnrichmentProviderConfig,
  CompanyEnrichment,
  ContactEnrichment,
  SocialEnrichment,
  TechnologyEnrichment,
  ProviderResponse,
  EnrichmentResult
} from './enrichmentTypes';
import { Lead } from '../api';

// Rate limiting implementation
class RateLimiter {
  private requests: { timestamp: number }[] = [];
  private config: EnrichmentProviderConfig;

  constructor(config: EnrichmentProviderConfig) {
    this.config = config;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - (this.config.rateLimit.period * 1000);
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(req => req.timestamp > windowStart);
    
    return this.requests.length < this.config.rateLimit.requests;
  }

  addRequest(): void {
    this.requests.push({ timestamp: Date.now() });
  }
}

// Base provider class with generic type parameter
abstract class EnrichmentProvider<T> {
  protected config: EnrichmentProviderConfig;
  private rateLimiter: RateLimiter;

  constructor(config: EnrichmentProviderConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter(config);
  }

  async enrichData(lead: Lead, endpoint: string): Promise<ProviderResponse<T>> {
    if (!this.config.enabled) {
      return {
        success: false,
        error: 'Provider is disabled',
        timestamp: new Date().toISOString()
      };
    }

    if (!this.rateLimiter.canMakeRequest()) {
      return {
        success: false,
        error: 'Rate limit exceeded',
        timestamp: new Date().toISOString()
      };
    }

    try {
      this.rateLimiter.addRequest();
      // Mock API call - in real implementation, this would be an actual HTTP request
      const response = await this.mockApiCall(lead, endpoint);
      return {
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  protected abstract mockApiCall(lead: Lead, endpoint: string): Promise<T>;
}

// Company data provider
class CompanyDataProvider extends EnrichmentProvider<CompanyEnrichment> {
  protected async mockApiCall(lead: Lead): Promise<CompanyEnrichment> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      name: lead.company,
      domain: `${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
      industry: 'Technology',
      employeeCount: Math.floor(Math.random() * 1000) + 50,
      revenue: '$1M - $10M',
      location: {
        country: 'United States',
        city: 'San Francisco'
      },
      description: `${lead.company} is a technology company...`
    };
  }
}

// Contact information provider
class ContactInfoProvider extends EnrichmentProvider<ContactEnrichment> {
  protected async mockApiCall(lead: Lead): Promise<ContactEnrichment> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      email: {
        valid: true,
        format: 'business',
        score: 0.95
      },
      phone: {
        valid: true,
        type: 'business',
        countryCode: '+1'
      },
      additionalEmails: [],
      additionalPhones: []
    };
  }
}

// Social media provider
class SocialMediaProvider extends EnrichmentProvider<SocialEnrichment> {
  protected async mockApiCall(lead: Lead): Promise<SocialEnrichment> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      linkedin: {
        profileUrl: `https://linkedin.com/company/${lead.company.toLowerCase().replace(/\s+/g, '-')}`,
        followers: Math.floor(Math.random() * 10000) + 1000
      },
      twitter: {
        handle: `@${lead.company.toLowerCase().replace(/\s+/g, '')}`,
        followers: Math.floor(Math.random() * 50000) + 5000
      }
    };
  }
}

// Technology stack provider
class TechnologyStackProvider extends EnrichmentProvider<TechnologyEnrichment> {
  protected async mockApiCall(lead: Lead): Promise<TechnologyEnrichment> {
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      categories: ['Frontend', 'Backend', 'Database', 'Cloud'],
      mainTechnology: 'Node.js'
    };
  }
}

// Provider registry
const providers = {
  company: new CompanyDataProvider({
    id: 'company-data',
    name: 'Company Data Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.companydata.com',
    rateLimit: { requests: 100, period: 60 },
    timeout: 5000,
    priority: 1,
    enabled: true
  }),
  contact: new ContactInfoProvider({
    id: 'contact-info',
    name: 'Contact Info Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.contactverify.com',
    rateLimit: { requests: 200, period: 60 },
    timeout: 3000,
    priority: 2,
    enabled: true
  }),
  social: new SocialMediaProvider({
    id: 'social-media',
    name: 'Social Media Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.socialmedia.com',
    rateLimit: { requests: 150, period: 60 },
    timeout: 4000,
    priority: 3,
    enabled: true
  }),
  technology: new TechnologyStackProvider({
    id: 'tech-stack',
    name: 'Technology Stack Provider',
    apiKey: 'mock-api-key',
    baseUrl: 'https://api.techdetect.com',
    rateLimit: { requests: 50, period: 60 },
    timeout: 6000,
    priority: 4,
    enabled: true
  })
};

export const enrichmentProviders = {
  // Get enrichment data from all providers
  async enrichLead(lead: Lead): Promise<EnrichmentResult[]> {
    const results: EnrichmentResult[] = [];

    // Company data
    const companyData = await providers.company.enrichData(lead, '/company');
    if (companyData.success && companyData.data) {
      results.push({
        success: true,
        enrichedAt: companyData.timestamp,
        source: 'company-data',
        data: companyData.data
      });
    }

    // Contact information
    const contactData = await providers.contact.enrichData(lead, '/contact');
    if (contactData.success && contactData.data) {
      results.push({
        success: true,
        enrichedAt: contactData.timestamp,
        source: 'contact-info',
        data: contactData.data
      });
    }

    // Social media profiles
    const socialData = await providers.social.enrichData(lead, '/social');
    if (socialData.success && socialData.data) {
      results.push({
        success: true,
        enrichedAt: socialData.timestamp,
        source: 'social-media',
        data: socialData.data
      });
    }

    // Technology stack
    const techData = await providers.technology.enrichData(lead, '/technology');
    if (techData.success && techData.data) {
      results.push({
        success: true,
        enrichedAt: techData.timestamp,
        source: 'tech-stack',
        data: techData.data
      });
    }

    return results;
  }
};