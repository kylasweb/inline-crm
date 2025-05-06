import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QualificationRuleList } from "@/components/qualification/QualificationRuleList";
import { QualificationRuleForm } from "@/components/qualification/QualificationRuleForm";
import { QualificationMatrix } from "@/components/qualification/QualificationMatrix";
import { QualityScoreCard } from "@/components/qualification/QualityScoreCard";
import { ScoringRule, QualificationResult } from "@/services/qualification/qualificationTypes";
import { Lead } from "@/services/api";
import { scoringRulesService } from "@/services/qualification/scoringRules";
import { qualificationService } from "@/services/qualification/qualificationService";

const LeadQualification = () => {
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ScoringRule | undefined>();
  const [qualificationData, setQualificationData] = useState<QualificationResult | null>(null);

  // Demo lead with all required properties from Lead interface
  const demoLead: Lead = {
    id: "DEMO-1",
    name: "Demo Lead",
    company: "Demo Company",
    email: "demo@example.com",
    phone: "+1-555-0123",
    createdAt: new Date().toISOString(),
    status: "New",
    source: "Website",
    score: 0,
    assignedTo: "John Doe",
    lastContact: null,
    notes: "Demo lead for qualification testing"
  };

  useEffect(() => {
    const loadQualificationData = async () => {
      const result = await qualificationService.calculateLeadScore(demoLead);
      setQualificationData(result);
    };
    loadQualificationData();
  }, []);

  const handleRuleSubmit = async (rule: ScoringRule) => {
    // In a real app, this would update the rule in the backend
    console.log("Rule submitted:", rule);
    setIsRuleFormOpen(false);
    setSelectedRule(undefined);
  };

  const handleEditRule = (rule: ScoringRule) => {
    setSelectedRule(rule);
    setIsRuleFormOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lead Qualification</h1>
        <Button onClick={() => setIsRuleFormOpen(true)}>
          Create New Rule
        </Button>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList>
          <TabsTrigger value="rules">Qualification Rules</TabsTrigger>
          <TabsTrigger value="matrix">Scoring Matrix</TabsTrigger>
          <TabsTrigger value="scores">Lead Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <QualificationRuleList />
        </TabsContent>

        <TabsContent value="matrix">
          {qualificationData && (
            <div className="grid md:grid-cols-2 gap-6">
              <QualificationMatrix
                scoreComponents={qualificationData.scoreComponents}
                totalScore={qualificationData.totalScore}
                status={qualificationData.status}
              />
              <QualityScoreCard
                result={qualificationData}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="scores">
          <div className="grid gap-6">
            {qualificationData && (
              <QualityScoreCard
                result={qualificationData}
                engagementMetrics={{
                  websiteVisits: 5,
                  emailInteractions: 3,
                  downloadedContent: ["whitepaper.pdf"],
                  lastInteractionDate: new Date(),
                  totalTimeSpent: 1200,
                  formSubmissions: 2,
                }}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? "Edit Qualification Rule" : "Create Qualification Rule"}
            </DialogTitle>
          </DialogHeader>
          <QualificationRuleForm
            initialData={selectedRule}
            onSubmit={handleRuleSubmit}
            onCancel={() => {
              setIsRuleFormOpen(false);
              setSelectedRule(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadQualification;