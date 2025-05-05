import { 
  QualificationStatus, 
  QualificationResult, 
  LeadScoreComponents,
  QualifiedLead,
  EngagementMetrics,
  DemographicCriteria,
  RuleEvaluationResult
} from './qualificationTypes';
import { scoringRulesService } from './scoringRules';
import { Lead } from '../api';

class QualificationService {
  private static readonly QUALIFICATION_THRESHOLDS = {
    MARKETING_QUALIFIED: 50,
    SALES_QUALIFIED: 80
  };

  // Calculate total lead score based on all components
  async calculateLeadScore(lead: Lead): Promise<QualificationResult> {
    const qualifiedLead = this.enrichLeadData(lead);
    const scoreComponents = await this.calculateScoreComponents(qualifiedLead);
    const totalScore = this.calculateTotalScore(scoreComponents);
    const status = this.determineQualificationStatus(totalScore);

    return {
      leadId: lead.id,
      totalScore,
      scoreComponents,
      status,
      lastUpdated: new Date(),
      appliedRules: [],
      ...(status !== QualificationStatus.UNQUALIFIED && { qualifiedAt: new Date() })
    };
  }

  // Calculate individual score components
  private async calculateScoreComponents(lead: QualifiedLead): Promise<LeadScoreComponents> {
    const rules = await this.getActiveRules();
    const evaluations: RuleEvaluationResult[] = [];

    for (const rule of rules) {
      const result = scoringRulesService.evaluateRule(rule, lead);
      if (result.matched) {
        evaluations.push(result);
      }
    }

    return {
      demographicScore: this.sumScoresByCategory(evaluations, 'demographic'),
      companyScore: this.sumScoresByCategory(evaluations, 'company'),
      engagementScore: this.sumScoresByCategory(evaluations, 'engagement'),
      customScore: this.sumScoresByCategory(evaluations, 'custom')
    };
  }

  // Calculate demographic score based on criteria
  private calculateDemographicScore(criteria: DemographicCriteria): number {
    let score = 0;

    if (criteria.industry) score += 10;
    if (criteria.companySize && criteria.companySize > 100) score += 15;
    if (criteria.revenue && criteria.revenue > 1000000) score += 20;
    if (criteria.location) score += 5;

    return Math.min(score, 50); // Cap at 50 points
  }

  // Calculate engagement score based on metrics
  private calculateEngagementScore(metrics: EngagementMetrics): number {
    let score = 0;

    score += Math.min(metrics.websiteVisits * 2, 20);
    score += Math.min(metrics.emailInteractions * 3, 15);
    score += metrics.downloadedContent.length * 5;
    score += metrics.formSubmissions * 10;

    // Recency bonus
    const daysSinceLastInteraction = this.getDaysSinceDate(metrics.lastInteractionDate);
    if (daysSinceLastInteraction <= 7) score += 10;
    else if (daysSinceLastInteraction <= 30) score += 5;

    return Math.min(score, 50); // Cap at 50 points
  }

  // Helper method to sum scores by category
  private sumScoresByCategory(evaluations: RuleEvaluationResult[], category: string): number {
    return evaluations
      .filter(evaluation => evaluation.category === category)
      .reduce((sum, evaluation) => sum + evaluation.score, 0);
  }

  // Calculate final total score
  private calculateTotalScore(components: LeadScoreComponents): number {
    return Object.values(components).reduce((sum, score) => sum + score, 0);
  }

  // Determine qualification status based on score
  private determineQualificationStatus(totalScore: number): QualificationStatus {
    if (totalScore >= QualificationService.QUALIFICATION_THRESHOLDS.SALES_QUALIFIED) {
      return QualificationStatus.SALES_QUALIFIED;
    } else if (totalScore >= QualificationService.QUALIFICATION_THRESHOLDS.MARKETING_QUALIFIED) {
      return QualificationStatus.MARKETING_QUALIFIED;
    } else if (totalScore > 0) {
      return QualificationStatus.IN_PROGRESS;
    }
    return QualificationStatus.UNQUALIFIED;
  }

  // Enrich lead data with engagement metrics and demographic data
  private enrichLeadData(lead: Lead): QualifiedLead {
    // In a real implementation, this would fetch data from various sources
    return {
      ...lead,
      qualificationData: {
        leadId: lead.id,
        totalScore: 0,
        scoreComponents: {
          demographicScore: 0,
          companyScore: 0,
          engagementScore: 0,
          customScore: 0
        },
        status: QualificationStatus.UNQUALIFIED,
        lastUpdated: new Date(),
        appliedRules: []
      }
    };
  }

  // Get active scoring rules
  private async getActiveRules() {
    // In a real implementation, this would fetch from an API or database
    return scoringRulesService.getDefaultTemplates()
      .filter(rule => rule.isActive);
  }

  // Helper method to calculate days since a date
  private getDaysSinceDate(date: Date): number {
    const diffTime = Math.abs(new Date().getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const qualificationService = new QualificationService();