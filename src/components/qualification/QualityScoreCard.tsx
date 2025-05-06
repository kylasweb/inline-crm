import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  QualificationResult,
  QualificationStatus,
  EngagementMetrics,
} from "@/services/qualification/qualificationTypes";

interface QualityScoreCardProps {
  result: QualificationResult;
  engagementMetrics?: EngagementMetrics;
}

export const QualityScoreCard: React.FC<QualityScoreCardProps> = ({
  result,
  engagementMetrics
}) => {
  const getStatusColor = (status: QualificationStatus) => {
    switch (status) {
      case QualificationStatus.SALES_QUALIFIED:
        return "bg-green-100 text-green-800 border-green-300";
      case QualificationStatus.MARKETING_QUALIFIED:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case QualificationStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case QualificationStatus.UNQUALIFIED:
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Lead Quality Score</h2>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(result.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        <Badge 
          variant="outline" 
          className={`px-3 py-1 ${getStatusColor(result.status)}`}
        >
          {result.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-4xl font-bold mb-2">{result.totalScore}</div>
          <div className="text-sm text-gray-600">Total Score</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-4xl font-bold mb-2">
            {result.appliedRules.length}
          </div>
          <div className="text-sm text-gray-600">Rules Applied</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Score Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Demographic Score</span>
              <Badge variant="secondary">
                {result.scoreComponents.demographicScore}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Company Score</span>
              <Badge variant="secondary">
                {result.scoreComponents.companyScore}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Engagement Score</span>
              <Badge variant="secondary">
                {result.scoreComponents.engagementScore}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Custom Score</span>
              <Badge variant="secondary">
                {result.scoreComponents.customScore}
              </Badge>
            </div>
          </div>
        </div>

        {engagementMetrics && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Engagement Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Website Visits</span>
                  <span>{engagementMetrics.websiteVisits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email Interactions</span>
                  <span>{engagementMetrics.emailInteractions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Content Downloads</span>
                  <span>{engagementMetrics.downloadedContent.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Form Submissions</span>
                  <span>{engagementMetrics.formSubmissions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Interaction</span>
                  <span>{new Date(engagementMetrics.lastInteractionDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {result.qualifiedAt && (
          <>
            <Separator />
            <div className="pt-2">
              <span className="text-sm text-gray-500">
                Qualified on: {new Date(result.qualifiedAt).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};