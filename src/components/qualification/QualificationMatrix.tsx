import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LeadScoreComponents, QualificationStatus } from "@/services/qualification/qualificationTypes";

interface QualificationMatrixProps {
  scoreComponents: LeadScoreComponents;
  totalScore: number;
  status: QualificationStatus;
}

export const QualificationMatrix: React.FC<QualificationMatrixProps> = ({
  scoreComponents,
  totalScore,
  status
}) => {
  const getStatusColor = (status: QualificationStatus) => {
    switch (status) {
      case QualificationStatus.SALES_QUALIFIED:
        return "bg-green-500";
      case QualificationStatus.MARKETING_QUALIFIED:
        return "bg-blue-500";
      case QualificationStatus.IN_PROGRESS:
        return "bg-yellow-500";
      case QualificationStatus.UNQUALIFIED:
        return "bg-gray-500";
      default:
        return "bg-red-500";
    }
  };

  const components = [
    { label: "Demographic Score", value: scoreComponents.demographicScore, max: 100 },
    { label: "Company Score", value: scoreComponents.companyScore, max: 100 },
    { label: "Engagement Score", value: scoreComponents.engagementScore, max: 100 },
    { label: "Custom Score", value: scoreComponents.customScore, max: 100 },
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Lead Qualification Matrix</h2>
          <div className={`px-3 py-1 rounded ${getStatusColor(status)}`}>
            <span className="text-white font-medium">
              {status.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={(totalScore / 400) * 100} className="h-3" />
          <span className="text-sm font-medium">
            {totalScore}/400
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {components.map((component) => (
          <div key={component.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{component.label}</span>
              <span className="text-sm text-gray-500">
                {component.value}/{component.max}
              </span>
            </div>
            <Progress 
              value={(component.value / component.max) * 100} 
              className="h-2" 
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Qualification Thresholds</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Marketing Qualified:</span>
            <span className="font-medium">50+ points</span>
          </div>
          <div className="flex justify-between">
            <span>Sales Qualified:</span>
            <span className="font-medium">80+ points</span>
          </div>
        </div>
      </div>
    </Card>
  );
};