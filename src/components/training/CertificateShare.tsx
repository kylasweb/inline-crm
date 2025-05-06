import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Share2,
  Download,
  Copy,
  Linkedin,
  Twitter,
  Mail,
  Shield,
  Loader2
} from 'lucide-react';

interface CertificateShareProps {
  certificateId: string;
  recipientName: string;
  courseName: string;
  completionDate: Date;
  grade: string;
  instructorName: string;
  verificationUrl: string;
}

export function CertificateShare({
  certificateId,
  recipientName,
  courseName,
  completionDate,
  grade,
  instructorName,
  verificationUrl
}: CertificateShareProps) {
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);

      toast({
        title: 'Success',
        description: 'Certificate downloaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download certificate',
        variant: 'destructive'
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async (platform: 'linkedin' | 'twitter' | 'email') => {
    setSharing(true);
    try {
      const shareText = `I've completed ${courseName}! Check out my certificate: ${verificationUrl}`;
      
      switch (platform) {
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}&summary=${encodeURIComponent(shareText)}`,
            '_blank'
          );
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
            '_blank'
          );
          break;
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(`${courseName} Certificate`)}&body=${encodeURIComponent(shareText)}`;
          break;
      }

      toast({
        title: 'Success',
        description: 'Certificate shared successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share certificate',
        variant: 'destructive'
      });
    } finally {
      setSharing(false);
    }
  };

  const copyVerificationLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      toast({
        title: 'Success',
        description: 'Verification link copied to clipboard'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive'
      });
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(window.location.origin + '/verify-certificate/' + certificateId)}&size=200x200`;

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <Card>
        <CardContent className="p-6">
          <div
            ref={certificateRef}
            className="relative aspect-video bg-white p-8 border-8 border-primary/10"
          >
            <div className="absolute top-4 right-4">
              <img src={qrCodeUrl} alt="Certificate QR Code" className="w-20 h-20" />
            </div>

            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="absolute top-8 left-8">
                <img
                  src="/company-logo.svg"
                  alt="Company Logo"
                  className="h-12"
                />
              </div>

              <h1 className="text-3xl font-serif text-primary mb-2">
                Certificate of Completion
              </h1>

              <p className="text-lg">This certifies that</p>

              <h2 className="text-2xl font-bold">{recipientName}</h2>

              <p className="text-lg max-w-2xl">
                has successfully completed the course
              </p>

              <h3 className="text-xl font-bold text-primary">
                {courseName}
              </h3>

              <div className="mt-8 space-y-2">
                <p>with a grade of <span className="font-bold">{grade}</span></p>
                <p className="text-sm">
                  Completed on {completionDate.toLocaleDateString()}
                </p>
              </div>

              <div className="absolute bottom-8 w-full flex justify-around px-12">
                <div className="text-center">
                  <div className="w-32 h-px bg-gray-300 mb-2" />
                  <p className="text-sm">{instructorName}</p>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-px bg-gray-300 mb-2" />
                  <p className="text-sm">Certificate ID</p>
                  <p className="text-xs text-muted-foreground">{certificateId}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sharing Options */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Achievement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('linkedin')}
                disabled={sharing}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('twitter')}
                disabled={sharing}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('email')}
                disabled={sharing}
              >
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </Button>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download Certificate
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={copyVerificationLink}
              >
                <Shield className="h-4 w-4 mr-2" />
                Copy Verification Link
              </Button>

              <div className="flex flex-col items-center space-y-4 border rounded-lg p-4">
                <img src={qrCodeUrl} alt="Certificate QR Code" className="w-48 h-48" />
                <p className="text-sm text-muted-foreground">Scan to verify certificate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}