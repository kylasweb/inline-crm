import { Lead } from '../api';

// Base interface for enrichment results
export interface EnrichmentResult {
  success: boolean;
  enrichedAt: string;
  source: string;
  data: CompanyEnrichment | ContactEnrichment | SocialEnrichment | TechnologyEnrichment;
}

// Company enrichment data
export interface CompanyEnrichment {
  name: string;
  domain: string;
  industry: string;
  employeeCount: number;
  revenue?: string;
  location?: {
    country: string;
    city: string;
  };
  description?: string;
}

// Contact information enrichment
export interface ContactEnrichment {
  email: {
    valid: boolean;
    format: string;
    score: number;
  };
  phone: {
    valid: boolean;
    type: string;
    countryCode: string;
  };
  additionalEmails?: string[];
  additionalPhones?: string[];
}

// Social media profile enrichment
export interface SocialEnrichment {
  linkedin?: {
    profileUrl: string;
    followers?: number;
    connections?: number;
  };
  twitter?: {
    handle: string;
    followers?: number;
  };
  facebook?: {
    pageUrl: string;
    likes?: number;
  };
}

// Technology stack enrichment
export interface TechnologyEnrichment {
  technologies: string[];
  categories: string[];
  mainTechnology?: string;
}

// Provider configuration
export interface EnrichmentProviderConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  rateLimit: {
    requests: number;
    period: number; // in seconds
  };
  timeout: number;
  priority: number;
  enabled: boolean;
}

// Data validation rules
export interface ValidationRule {
  field: string;
  type: 'required' | 'format' | 'range';
  value?: any;
  message: string;
}

// Enrichment status
export interface EnrichmentStatus {
  leadId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  attempts: number;
  error?: string;
  providers: {
    name: string;
    status: 'success' | 'failed' | 'skipped';
    timestamp: string;
  }[];
}

// Combined enrichment data
export interface LeadEnrichmentData {
  company?: CompanyEnrichment;
  contact?: ContactEnrichment;
  social?: SocialEnrichment;
  technology?: TechnologyEnrichment;
  status: EnrichmentStatus;
}

// Provider response
export interface ProviderResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimitRemaining?: number;
  timestamp: string;
}