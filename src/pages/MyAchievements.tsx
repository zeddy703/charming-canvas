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
      
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg shrink-0">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-heading font-bold truncate">My Achievements</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">View your membership card and certificates</p>
              </div>
            </div>

            {/* Membership ID Card Section */}
            <Card className="overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <IdCard className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span className="truncate">Membership ID Card</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your official Scottish Rite membership identification</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
                {loading ? (
                  <div className="flex justify-center">
                    <Skeleton className="w-full max-w-md h-48 sm:h-56 md:h-64 rounded-xl" />
                  </div>
                ) : memberInfo ? (
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    {/* ID Card */}
                    <div className="w-full max-w-md">
                      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden aspect-[1.6/1]">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 border-2 sm:border-4 border-white rounded-full" />
                          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 border-2 sm:border-4 border-white rounded-full" />
                          <div 
                            className="absolute inset-0" 
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                          />
                        </div>

                        {/* Card Content */}
                        <div className="relative h-full p-3 sm:p-4 md:p-5 flex flex-col justify-between text-primary-foreground">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 shrink-0" />
                                <span className="text-[8px] sm:text-[10px] md:text-xs font-medium tracking-wider uppercase opacity-90 truncate">
                                  Scottish Rite
                                </span>
                              </div>
                              <p className="text-[7px] sm:text-[8px] md:text-[10px] opacity-75 truncate">Ancient Accepted Scottish Rite</p>
                              <p className="text-[7px] sm:text-[8px] md:text-[10px] opacity-75 truncate hidden xs:block">Northern Masonic Jurisdiction, USA</p>
                            </div>
                            <div className="shrink-0">
                              <span className={`inline-block px-1.5 sm:px-2 py-0.5 text-[7px] sm:text-[8px] md:text-[10px] font-semibold rounded-full whitespace-nowrap ${
                                memberInfo.status === 'Active' 
                                  ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
                                  : 'bg-red-500/20 text-red-200 border border-red-400/30'
                              }`}>
                                {memberInfo.status}
                              </span>
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="flex items-end gap-2 sm:gap-3 md:gap-4">
                            {/* Photo */}
                            <div className="shrink-0">
                              <div className="w-10 h-12 sm:w-12 sm:h-16 md:w-16 md:h-20 rounded-md sm:rounded-lg overflow-hidden border sm:border-2 border-white/30 shadow-lg bg-white/10">
                                {memberInfo.photo ? (
                                  <img 
                                    src={memberInfo.photo} 
                                    alt={`${memberInfo.firstName} ${memberInfo.lastName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sm sm:text-lg md:text-2xl font-bold">
                                    {memberInfo.firstName[0]}{memberInfo.lastName[0]}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs sm:text-sm md:text-lg font-bold truncate">
                                {memberInfo.firstName} {memberInfo.lastName}
                              </h3>
                              <p className="text-[8px] sm:text-[10px] md:text-xs opacity-90 truncate">{memberInfo.degree}</p>
                              <div className="mt-1 sm:mt-2 grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 text-[7px] sm:text-[8px] md:text-[10px]">
                                <div className="min-w-0">
                                  <span className="opacity-60 block">Member ID</span>
                                  <span className="font-mono font-semibold truncate block">{memberInfo.membershipId}</span>
                                </div>
                                <div className="min-w-0">
                                  <span className="opacity-60 block">Expires</span>
                                  <span className="font-semibold">{formatDate(memberInfo.expiryDate)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-[7px] sm:text-[8px] md:text-[9px] opacity-70 pt-1 sm:pt-2 border-t border-white/20 gap-2">
                            <div className="flex items-center gap-0.5 sm:gap-1 min-w-0 flex-1">
                              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                              <span className="truncate">{memberInfo.valley}</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              <span className="whitespace-nowrap">Joined: {formatDate(memberInfo.dateJoined)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Holographic Effect Strip */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500" />
                      </div>
                    </div>

                    {/* Download Button */}
                    <Button onClick={handleDownloadCard} className="gap-2 w-full sm:w-auto" size="default">
                      <Download className="h-4 w-4" />
                      Download Card
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm">Unable to load member information</p>
                )}
              </CardContent>
            </Card>

            {/* Certificates Section */}
            <Card className="overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span className="truncate">My Certificates</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Download your achievement certificates</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
                {loading ? (
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-28 sm:h-32 rounded-lg" />
                    ))}
                  </div>
                ) : certificates.length > 0 ? (
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="group relative p-3 sm:p-4 rounded-lg sm:rounded-xl border bg-card hover:bg-accent/5 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <div className="p-1 sm:p-1.5 bg-primary/10 rounded-md shrink-0">
                                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                              </div>
                              <h4 className="font-semibold text-xs sm:text-sm truncate">{cert.name}</h4>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{cert.description}</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                              Issued: {formatDate(cert.dateIssued)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 sm:mt-3 gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm"
                          onClick={() => handleDownloadCertificate(cert.name)}
                        >
                          <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Award className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/30 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm text-muted-foreground">No certificates available yet</p>
                    <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
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
