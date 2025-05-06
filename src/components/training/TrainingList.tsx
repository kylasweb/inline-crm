import { useEffect, useState } from 'react';
import { Certification } from '@/services/training/trainingTypes';
import { trainingService } from '@/services/training/trainingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TrainingList() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCertifications() {
      try {
        const data = await trainingService.getCertifications();
        setCertifications(data);
        setError(null);
      } catch (err) {
        setError('Failed to load certifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCertifications();
  }, []);

  if (loading) {
    return <div>Loading certifications...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert) => (
        <Card key={cert.id}>
          <CardHeader>
            <CardTitle>{cert.name}</CardTitle>
            <CardDescription>{cert.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              {cert.trainingPrograms.length} Training Programs
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}