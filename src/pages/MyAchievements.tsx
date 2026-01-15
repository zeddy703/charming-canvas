import { useState, useEffect } from 'react';
import { Award, Download, IdCard, FileText, Calendar, MapPin, Shield } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import apiRequest from '@/utils/api';

interface MemberInfo {
  id: string;
  membershipId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  dateJoined: string;
  expiryDate: string;
  degree: string;
  valley: string;
  orient: string;
  status: string;
}

interface Certificate {
  id: string;
  name: string;
  description: string;
  dateIssued: string;
  downloadUrl: string;
}

const MyAchievements = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const data = await apiRequest<{ member: MemberInfo; certificates: Certificate[] }>(
          '/api/members-center/member-info',
          { method: 'GET' }
        );
        setMemberInfo(data.member);
        setCertificates(data.certificates || []);
      } catch (error) {
        // Use mock data for demo
        setMemberInfo({
          id: '1',
          membershipId: 'SR-2024-78542',
          firstName: 'John',
          lastName: 'Anderson',
          email: 'john.anderson@email.com',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          dateJoined: '2019-03-15',
          expiryDate: '2025-12-31',
          degree: '32° Master of the Royal Secret',
          valley: 'Valley of Boston',
          orient: 'Orient of Massachusetts',
          status: 'Active',
        });
        setCertificates([
          {
            id: '1',
            name: '32° Degree Certificate',
            description: 'Master of the Royal Secret',
            dateIssued: '2023-06-20',
            downloadUrl: '#',
          },
          {
            id: '2',
            name: 'Pathfinder Completion',
            description: 'Successfully completed the Pathfinder Program',
            dateIssued: '2024-01-15',
            downloadUrl: '#',
          },
          {
            id: '3',
            name: 'Valley of Excellence',
            description: 'Gold Tier Achievement Award',
            dateIssued: '2024-09-10',
            downloadUrl: '#',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  const handleDownloadCard = () => {
    toast({
      title: 'Downloading...',
      description: 'Your membership card is being prepared for download.',
    });
  };

  const handleDownloadCertificate = (certName: string) => {
    toast({
      title: 'Downloading...',
      description: `${certName} is being prepared for download.`,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">My Achievements</h1>
                <p className="text-muted-foreground">View your membership card and certificates</p>
              </div>
            </div>

            {/* Membership ID Card Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-5 w-5" />
                  Membership ID Card
                </CardTitle>
                <CardDescription>Your official Scottish Rite membership identification</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center">
                    <Skeleton className="w-full max-w-md h-64 rounded-xl" />
                  </div>
                ) : memberInfo ? (
                  <div className="flex flex-col items-center gap-4">
                    {/* ID Card */}
                    <div className="w-full max-w-md">
                      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent rounded-2xl shadow-2xl overflow-hidden aspect-[1.6/1]">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
                          <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
                          <div 
                            className="absolute inset-0" 
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                          />
                        </div>

                        {/* Card Content */}
                        <div className="relative h-full p-5 flex flex-col justify-between text-primary-foreground">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Shield className="h-5 w-5" />
                                <span className="text-xs font-medium tracking-wider uppercase opacity-90">
                                  Scottish Rite
                                </span>
                              </div>
                              <p className="text-[10px] opacity-75">Ancient Accepted Scottish Rite</p>
                              <p className="text-[10px] opacity-75">Northern Masonic Jurisdiction, USA</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                memberInfo.status === 'Active' 
                                  ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
                                  : 'bg-red-500/20 text-red-200 border border-red-400/30'
                              }`}>
                                {memberInfo.status}
                              </span>
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="flex items-end gap-4">
                            {/* Photo */}
                            <div className="shrink-0">
                              <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg bg-white/10">
                                {memberInfo.photo ? (
                                  <img 
                                    src={memberInfo.photo} 
                                    alt={`${memberInfo.firstName} ${memberInfo.lastName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                                    {memberInfo.firstName[0]}{memberInfo.lastName[0]}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold truncate">
                                {memberInfo.firstName} {memberInfo.lastName}
                              </h3>
                              <p className="text-xs opacity-90 truncate">{memberInfo.degree}</p>
                              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                                <div>
                                  <span className="opacity-60 block">Member ID</span>
                                  <span className="font-mono font-semibold">{memberInfo.membershipId}</span>
                                </div>
                                <div>
                                  <span className="opacity-60 block">Expires</span>
                                  <span className="font-semibold">{formatDate(memberInfo.expiryDate)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-[9px] opacity-70 pt-2 border-t border-white/20">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{memberInfo.valley}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Joined: {formatDate(memberInfo.dateJoined)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Holographic Effect Strip */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500" />
                      </div>
                    </div>

                    {/* Download Button */}
                    <Button onClick={handleDownloadCard} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Card
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Unable to load member information</p>
                )}
              </CardContent>
            </Card>

            {/* Certificates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Certificates
                </CardTitle>
                <CardDescription>Download your achievement certificates</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                  </div>
                ) : certificates.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="group relative p-4 rounded-xl border bg-card hover:bg-accent/5 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 bg-primary/10 rounded-md">
                                <Award className="h-4 w-4 text-primary" />
                              </div>
                              <h4 className="font-semibold text-sm truncate">{cert.name}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{cert.description}</p>
                            <p className="text-[10px] text-muted-foreground">
                              Issued: {formatDate(cert.dateIssued)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 gap-2"
                          onClick={() => handleDownloadCertificate(cert.name)}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No certificates available yet</p>
                    <p className="text-sm text-muted-foreground/70">
                      Complete milestones and achievements to earn certificates
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyAchievements;
