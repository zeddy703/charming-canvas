import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  memberId: string;
  valley: string;
  joinDate: string;
  degree: string;
  avatarUrl?: string;
}

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Dialog states
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    memberId: '',
    valley: '',
    joinDate: '',
    degree: '',
    avatarUrl: undefined,
  });

  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch('http://localhost:3000/api/user/account/profile/info', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to load profile');

        const json = await res.json();
        if (!json.success || !json.user) throw new Error('Invalid response format');

        const data = json.user;

        const formattedProfile: ProfileData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          memberId: data.memberId || 'N/A',
          valley: data.valley || 'Unknown Valley',
          joinDate: formatDate(data.joinDate),
          degree: data.degree || '—',
          avatarUrl: data.photoURL || undefined,
        };

        setProfile(formattedProfile);
        setOriginalProfile(formattedProfile);
        setPreviewAvatar(formattedProfile.avatarUrl || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrorMessage('Failed to load profile. Please try again later.');
        setErrorDialogOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = () => {
    if (!profile.firstName || !profile.lastName) return '??';
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      setErrorDialogOpen(true);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image must be smaller than 5MB.');
      setErrorDialogOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewAvatar(reader.result as string);
    reader.readAsDataURL(file);

    uploadAvatar(file);
  };

const uploadAvatar = async (file: File) => {
  setUploadingAvatar(true);

  try {
    console.log('Uploading avatar:', file.size, 'bytes');

    // Step 1: Request pre-signed URL
    const presignRes = await fetch(
      'http://localhost:3000/api/user/account/profile/avatar/presign',
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
          fileData: null
        }),
      }
    );

    if (!presignRes.ok) throw new Error('Failed to get pre-signed URL');

    const presignJson = await presignRes.json();

    if (!presignJson.success || !presignJson.url) {
      throw new Error('Invalid pre-signed response');
    }

    const { avatarUrl } = presignJson.url;

    // Step 2: Upload to S3
    const uploadRes = await fetch(avatarUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadRes.ok) throw new Error('Failed to upload');

    setProfile(prev => ({ ...prev, avatarUrl:  avatarUrl}));
    setPreviewAvatar(avatarUrl);
    setSuccessDialogOpen(true);
  } catch (err) {
    console.error('Avatar upload failed:', err);
    setErrorMessage('Failed to upload image. Please try again.');
    setErrorDialogOpen(true);
    setPreviewAvatar(profile.avatarUrl || null);
  } finally {
    setUploadingAvatar(false);
  }
};


  const removeAvatar = async () => {
    if (!confirm('Remove your profile picture?')) return;

    try {
      const res = await fetch('http://localhost:3000/api/members-center/profile/avatar', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to remove avatar');

      setProfile(prev => ({ ...prev, avatarUrl: undefined }));
      setPreviewAvatar(null);
      setSuccessDialogOpen(true);
    } catch (err) {
      setErrorMessage('Failed to remove avatar.');
      setErrorDialogOpen(true);
    }
  };

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3000/api/user/account/profile/update', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: profile }),
      });

      if (!res.ok) throw new Error('Save failed');

      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Save failed');

      setIsEditing(false);
      setOriginalProfile(profile);
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error('Save failed:', err);
      setErrorMessage('Failed to save profile. Please try again.');
      setErrorDialogOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
      setPreviewAvatar(originalProfile.avatarUrl || null);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
                  My Profile
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your personal information and profile picture
                </p>
              </div>

              {!loading && (
                <div className="flex gap-3">
                  {isEditing && (
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    disabled={loading || saving || uploadingAvatar}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Loading & Error States */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="h-96 bg-card/50 border border-border rounded-2xl animate-pulse" />
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-card/50 border border-border rounded-2xl animate-pulse" />
                  <div className="h-64 bg-card/50 border border-border rounded-2xl animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar & Info Card */}
                <div className="progress-card p-8 text-center animate-fade-in">
                  <div className="relative inline-block mb-8">
                    <div
                      className="w-40 h-40 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center cursor-pointer hover:ring-8 hover:ring-primary/20 transition-all shadow-lg"
                      onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      ) : previewAvatar ? (
                        <img
                          src={previewAvatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl font-bold text-primary">
                          {getInitials()}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-3 shadow-xl hover:bg-primary/90 transition-colors cursor-pointer">
                      <Upload size={20} />
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  {previewAvatar && !uploadingAvatar && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeAvatar}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X size={16} className="mr-2" />
                      Remove Photo
                    </Button>
                  )}

                  <h2 className="font-heading text-3xl font-bold text-foreground mt-8">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-primary font-semibold text-xl mt-2">
                    {profile.degree} Scottish Rite Mason
                  </p>
                  <p className="text-muted-foreground mt-1">{profile.valley}</p>

                  <div className="mt-8 pt-8 border-t border-border space-y-4">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Shield size={18} />
                      <span>Member ID: {profile.memberId}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Calendar size={18} />
                      <span>Member since {profile.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Forms */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="progress-card p-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-3">
                      <Mail className="text-primary" size={24} />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="progress-card p-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-3">
                      <MapPin className="text-primary" size={24} />
                      Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile.state}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={profile.zip}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-green-600">
              <CheckCircle2 size={24} />
              Success!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your changes have been saved successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuccessDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-destructive">
              <AlertCircle size={24} />
              Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;