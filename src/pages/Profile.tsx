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
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import apiRequest from '@/utils/api';

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
  const { toast } = useToast();

  const showToast = ({
    title,
    description,
    type,
  }: {
    title?: string;
    description?: string;
    type?: 'success' | 'error';
  }) => {
    toast({
      title: title || (type === 'success' ? 'Success' : 'Error'),
      description:
        description ||
        (type === 'success'
          ? 'Operation completed successfully.'
          : 'An unexpected error occurred. Please try again.'),
      variant: type === 'success' ? 'success' : 'destructive',
    });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Confirmation dialog for removing avatar
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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

  // Color palette for initials avatar
  const colorClasses = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];

  // Deterministic color based on name
  const getAvatarColor = () => {
    if (!profile.firstName && !profile.lastName) return colorClasses[0];

    const nameStr = (profile.firstName + profile.lastName).toLowerCase();
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorClasses.length;
    return colorClasses[index];
  };

  const getInitials = () => {
    if (!profile.firstName || !profile.lastName) return '??';
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await apiRequest<any>('/api/user/account/profile/info', {
          method: 'GET',
        });

        if (!res?.success) throw new Error('Failed to load profile');

        const data = res.user;

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({ title: 'Invalid File Type', description: 'Please select a valid image file.', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast({ title: 'File Too Large', description: 'Image must be smaller than 5MB.', type: 'error' });
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
      const presignRes = await apiRequest<{ success: boolean; avatarUrl: string }>(
        '/api/user/account/profile/avatar/presign',
        {
          method: 'POST',
          body: {
            filename: file.name,
            contentType: file.type,
            fileSize: file.size,
          },
        }
      );

      if (!presignRes?.success) throw new Error('Failed to get pre-signed URL');
      if (!presignRes?.avatarUrl) throw new Error('Invalid pre-signed response');

      const cleanUrl = presignRes.avatarUrl.split('?')[0];

      const uploadRes = await fetch(cleanUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error('Failed to upload to S3');

      const updateRes = await apiRequest<{ success: boolean }>('/api/user/account/profile/avatar/save', {
        method: 'PUT',
        body: { avatarUrl: cleanUrl },
      });

      if (!updateRes?.success) throw new Error('Failed to save avatar URL');

      setProfile(prev => ({ ...prev, avatarUrl: cleanUrl }));
      setPreviewAvatar(cleanUrl);

      showToast({
        title: 'Avatar Uploaded',
        description: 'Your profile picture has been updated successfully.',
        type: 'success',
      });
    } catch (err) {
      console.error('Avatar upload failed:', err);
      showToast({ title: 'Upload Failed', description: 'Please try again.', type: 'error' });
      setPreviewAvatar(profile.avatarUrl || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await apiRequest<{ success: boolean }>('/api/user/account/profile/avatar/remove', {
        method: 'DELETE',
      });

      if (!res?.success) throw new Error('Failed to remove avatar');

      setProfile(prev => ({ ...prev, avatarUrl: undefined }));
      setPreviewAvatar(null);
      setRemoveDialogOpen(false);
      showToast({
        title: 'Avatar Removed',
        description: 'Your profile picture has been removed.',
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to remove avatar:', err);
      setRemoveDialogOpen(false);
      showToast({ title: 'Removal Failed', description: 'Please try again.', type: 'error' });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiRequest<{ success: boolean }>('/api/user/account/profile/update', {
        method: 'PUT',
        body: { userData: profile },
      });

      if (!res?.success) throw new Error('Save failed');

      setIsEditing(false);
      setOriginalProfile(profile);
      showToast({
        title: 'Profile Saved',
        description: 'Your changes have been saved successfully.',
        type: 'success',
      });
    } catch (err) {
      console.error('Save failed:', err);
      showToast({ title: 'Save Failed', description: 'Please try again.', type: 'error' });
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

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast({
        title: 'Missing Fields',
        description: 'Please fill in all password fields.',
        type: 'error',
      });
      return;
    }

    if (newPassword.length < 8) {
      showToast({
        title: 'Password Too Short',
        description: 'New password must be at least 8 characters long.',
        type: 'error',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        title: 'Passwords Do Not Match',
        description: 'New password and confirm password must match.',
        type: 'error',
      });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await apiRequest<{ success: boolean; message?: string }>(
        '/api/user/account/password/change',
        {
          method: 'POST',
          body: { oldPassword, newPassword },
        }
      );

      if (!res?.success) {
        throw new Error(res?.message || 'Failed to change password');
      }

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast({
        title: 'Password Changed',
        description: 'Your password has been updated successfully.',
        type: 'success',
      });
    } catch (err: any) {
      console.error('Password change failed:', err);
      showToast({
        title: 'Password Change Failed',
        description: err?.message || 'Please check your old password and try again.',
        type: 'error',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">My Profile</h1>
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

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card Skeleton */}
                <div className="progress-card p-8 text-center">
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-40 h-40 rounded-full mb-8" />
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-6 w-40 mb-1" />
                    <Skeleton className="h-5 w-32" />
                    <div className="mt-8 pt-8 border-t border-border w-full space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <Skeleton className="h-5 w-36" />
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Skeleton className="h-5 w-44" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Address Skeletons */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Contact Information Skeleton */}
                  <div className="progress-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Address Skeleton */}
                  <div className="progress-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="progress-card p-8 text-center animate-fade-in">
                  <div className="relative inline-block mb-8">
                    <div
                      className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-8 hover:ring-primary/20 transition-all shadow-lg"
                      onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      ) : previewAvatar ? (
                        <img src={previewAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full ${getAvatarColor()} flex items-center justify-center`}>
                          <span className="text-5xl font-bold text-white">{getInitials()}</span>
                        </div>
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

                  {/* Remove Photo with Confirmation Dialog */}
                  {previewAvatar && !uploadingAvatar && (
                    <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X size={16} className="mr-2" />
                          Remove Photo
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Profile Picture?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your current profile picture will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleRemoveAvatar}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove Photo
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

                {/* Contact & Address Forms */}
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

                  {/* Change Password Card */}
                  <div className="progress-card p-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-3">
                      <Lock className="text-primary" size={24} />
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="oldPassword"
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter your current password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password (min 8 characters)"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <Button
                        onClick={handleChangePassword}
                        disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword}
                        className="w-full mt-2"
                      >
                        {changingPassword ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Changing Password...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Change Password
                          </>
                        )}
                      </Button>
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
            <AlertDialogAction>OK</AlertDialogAction>
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
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;