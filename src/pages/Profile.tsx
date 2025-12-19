import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Temple Street',
    city: 'Boston',
    state: 'MA',
    zip: '02101',
    memberId: 'SR-2020-45678',
    valley: 'Valley of Boston',
    joinDate: 'March 15, 2020',
    degree: '32°'
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and settings</p>
              </div>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "default" : "outline"}
              >
                {isEditing ? <><Save size={16} className="mr-2" /> Save Changes</> : <><Edit2 size={16} className="mr-2" /> Edit Profile</>}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="progress-card text-center animate-fade-in">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="text-primary" size={48} />
                </div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-primary font-medium">{profile.degree} Scottish Rite Mason</p>
                <p className="text-sm text-muted-foreground mt-1">{profile.valley}</p>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield size={14} />
                    <span>Member ID: {profile.memberId}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                    <Calendar size={14} />
                    <span>Member since {profile.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="progress-card animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Mail className="text-primary" size={20} />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName"
                        value={profile.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName"
                        value={profile.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        value={profile.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="progress-card animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="text-primary" size={20} />
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address"
                        value={profile.address}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        value={profile.city}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, city: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state"
                          value={profile.state}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, state: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP</Label>
                        <Input 
                          id="zip"
                          value={profile.zip}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, zip: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
