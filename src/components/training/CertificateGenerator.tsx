import { useEffect, useRef, useState } from 'react';
import { Certification, TrainingProgram, Result } from '@/services/training/trainingTypes';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateGeneratorProps {
  program: TrainingProgram;
  results: Result[];
  userName: string;
  completionDate: Date;
  certificateId: string;
}

export function CertificateGenerator({
  program,
  results,
  userName,
  completionDate,
  certificateId
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const averageScore = Math.round(
    results.reduce((sum, result) => sum + result.score, 0) / results.length
  );

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${program.name.replace(/\s+/g, '_')}_Certificate.pdf`);

      toast({
        title: 'Success',
        description: 'Certificate downloaded successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate certificate.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${program.name} Certificate`,
        text: `I completed the ${program.name} program!`,
        url: window.location.href
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Error',
          description: 'Failed to share certificate.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="border-2">
        <CardContent>
          <div
            ref={certificateRef}
            className="aspect-video bg-white p-8 relative"
            style={{
              backgroundImage: 'url(/certificate-background.svg)',
              backgroundSize: 'cover'
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="absolute top-4 left-4">
                <img
                  src="/company-logo.svg"
                  alt="Company Logo"
                  className="h-12"
                />
              </div>
              
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-serif text-primary">Certificate of Completion</h1>
                
                <p className="text-lg">This certifies that</p>
                
                <p className="text-2xl font-semibold">{userName}</p>
                
                <p className="text-lg">has successfully completed</p>
                
                <h2 className="text-xl font-bold text-primary">{program.name}</h2>
                
                <div className="mt-6 space-y-2">
                  <p className="text-sm">
                    with an average score of <span className="font-bold">{averageScore}%</span>
                  </p>
                  <p className="text-sm">
                    Completed on {completionDate.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Certificate ID: {certificateId}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-8 w-full flex justify-around px-12">
                <div className="text-center">
                  <div className="w-32 h-px bg-border mb-2" />
                  <p className="text-sm">Program Director</p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-px bg-border mb-2" />
                  <p className="text-sm">Academic Board</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleDownload}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}