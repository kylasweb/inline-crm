import { useState } from 'react';
import { TrainingList } from './TrainingList';
import { EnrolledProgramsList } from './EnrolledProgramsList';
import { CompletedProgramsList } from './CompletedProgramsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TrainingDashboard() {
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Training & Certifications</h1>
        <p className="text-gray-500">Browse and enroll in available training programs</p>
      </div>

      <Tabs defaultValue="available" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available Training</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Programs</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainingList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrolled">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <EnrolledProgramsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <CompletedProgramsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}