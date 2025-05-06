import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  Award,
  Calendar,
  User,
  Clock,
  Building,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface VerifiedCertificate {
  id: string;
  recipientName: string;
  programName: string;
  issueDate: Date;
  expiryDate?: Date;
  grade: string;
  organization: string;
  verificationHash: string;
  status: 'valid' | 'expired' | 'revoked';
}

export function CertificateVerification() {
  const { toast } = useToast();
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a certificate ID',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setVerificationAttempted(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock certificate verification
      if (certificateId.startsWith('CERT-')) {
        setCertificate({
          id: certificateId,
          recipientName: 'John Doe',
          programName: 'Advanced Web Development',
          issueDate: new Date('2025-01-15'),
          expiryDate: new Date('2028-01-15'),
          grade: 'A',
          organization: 'Tech Training Institute',
          verificationHash: '0x1234...5678',
          status: 'valid'
        });
      } else {
        setCertificate(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify certificate. Please try again.',
        variant: 'destructive'
      });
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: VerifiedCertificate['status']) => {
    switch (status) {
      case 'valid': return 'text-green-500';
      case 'expired': return 'text-yellow-500';
      case 'revoked': return 'text-red-500';
      default: return '';
    }
  };

  const getStatusMessage = (status: VerifiedCertificate['status']) => {
    switch (status) {
      case 'valid': return 'Certificate is valid and authentic';
      case 'expired': return 'Certificate has expired';
      case 'revoked': return 'Certificate has been revoked';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Certificate Verification Portal
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Verify the authenticity of training certificates
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter certificate ID (e.g., CERT-12345)"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Verify
            </Button>
          </div>

          {loading && (
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && verificationAttempted && (
            <Card className="border-dashed">
              <CardContent className="p-6">
                {certificate ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-5 w-5 ${getStatusColor(certificate.status)}`} />
                      <span className={`font-medium ${getStatusColor(certificate.status)}`}>
                        {getStatusMessage(certificate.status)}
                      </span>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Program
                        </div>
                        <div className="font-medium">{certificate.programName}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Recipient
                        </div>
                        <div className="font-medium">{certificate.recipientName}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Organization
                        </div>
                        <div className="font-medium">{certificate.organization}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Issue Date
                        </div>
                        <div className="font-medium">
                          {format(certificate.issueDate, 'PP')}
                        </div>
                      </div>

                      {certificate.expiryDate && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Valid Until
                          </div>
                          <div className="font-medium">
                            {format(certificate.expiryDate, 'PP')}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Grade
                        </div>
                        <div className="font-medium">{certificate.grade}</div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="text-sm text-muted-foreground">
                        Blockchain Verification Hash
                      </div>
                      <code className="text-xs bg-muted p-2 rounded-md block mt-1">
                        {certificate.verificationHash}
                      </code>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h3 className="mt-4 font-medium">Certificate Not Found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The certificate ID provided could not be verified.
                      Please check the ID and try again.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <p>
              Note: This verification process ensures the certificate's authenticity
              and validates its current status.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}