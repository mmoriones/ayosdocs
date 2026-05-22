'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Bell, 
  Globe, 
  Lock, 
  Palette, 
  Smartphone, 
  Shield, 
  Loader2, 
  CheckCircle2, 
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Trash2,
  ShieldAlert,
  Calendar,
  Languages,
  Settings,
  User,
  CreditCard,
  Eye,
  LogOut
} from 'lucide-react';
import { useTheme, useToast } from '@/context';
import { changePasswordAction } from '@/app/actions/user';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import SortDropdown from '@/components/ui/SortDropdown';
import Switch from '@/components/ui/Switch';

/**
 * Settings client page with interactive tab management and security features.
 */
export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState('General');
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const user = session?.user;

  const tabs = [
    { label: 'General', icon: Globe, description: 'Language and regional preferences' },
    { label: 'Appearance', icon: Palette, description: 'Themes and visual styling' },
    { label: 'Notifications', icon: Bell, description: 'Email and push alerts' },
    { label: 'Privacy & Security', icon: Shield, description: 'Data and account protection' },
    { label: 'Password', icon: Lock, description: 'Security credentials' },
  ];

  if (status === 'loading') {
    return (
      <div className="bg-ctp-base font-sans text-ctp-text min-h-screen pb-20">
        <PageHeader 
          icon={Settings}
          title="Settings"
          description="Manage your account settings and preferences."
        />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-2">
               {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="w-full h-14 rounded-xl opacity-20" />)}
            </div>
            <div className="lg:col-span-3">
               <Card><div className="space-y-6 py-4"><Skeleton className="w-1/2 h-6" /><Skeleton className="w-full h-64 rounded-xl" /></div></Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'General':
        return <GeneralSection />;
      case 'Appearance':
        return <AppearanceSection />;
      case 'Notifications':
        return <NotificationsSection />;
      case 'Privacy & Security':
        return <PrivacySection />;
      case 'Password':
        return <PasswordSection user={user} showToast={showToast} />;
      default:
        return <PlaceholderSection title={`${activeTab} Settings`} icon={tabs.find(t => t.label === activeTab)?.icon || Smartphone} />;
    }
  };

  return (
    <div className="bg-ctp-base font-sans text-ctp-text min-h-screen pb-20 transition-colors duration-300">
      <PageHeader 
        icon={Settings}
        title="Settings"
        description="Configure your workspace and privacy preferences."
        actions={
          <div className="flex items-center gap-3 bg-ctp-mantle/50 px-4 py-2 rounded-xl border border-ctp-surface1">
            <div className="w-8 h-8 rounded-full bg-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-ctp-text leading-tight">{user?.name || 'Guest User'}</span>
              <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-tighter">{user?.email || 'Not signed in'}</span>
            </div>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="flex flex-col gap-1.5 sticky top-24">
              <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] px-4 mb-2">Account Control</p>
              {tabs.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm transition-all duration-200 ${
                    activeTab === item.label 
                      ? 'bg-ctp-sky-800 text-white shadow-lg shadow-ctp-sky-800/20' 
                      : 'text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    activeTab === item.label ? 'bg-white/20' : 'bg-ctp-surface0 group-hover:bg-ctp-surface1'
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold tracking-tight">{item.label}</span>
                    {activeTab !== item.label && (
                      <span className="text-[10px] text-ctp-subtext1 opacity-60 font-medium group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {activeTab === item.label && (
                    <ChevronRight size={16} className="ml-auto opacity-60" />
                  )}
                </button>
              ))}
              
              <div className="mt-10 pt-6 border-t border-ctp-surface1">
                <button 
                  onClick={() => window.location.href = '/api/auth/signout'}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-ctp-red hover:bg-ctp-red/5 transition-all font-bold"
                >
                  <div className="p-1.5 rounded-lg bg-ctp-red/10">
                    <LogOut size={18} />
                  </div>
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * General workspace and regional settings.
 */
function GeneralSection() {
  const [lang, setLang] = useState('en');
  const [format, setFormat] = useState('MMM D, YYYY');

  const langOptions = [
    { label: 'English (US)', value: 'en' },
    { label: 'Tagalog (Soon)', value: 'ph' }
  ];

  const formatOptions = [
    { label: 'MMM D, YYYY', value: 'MMM D, YYYY' },
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }
  ];

  return (
    <Card title="General Settings" background="base" overflow="visible" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800">
                <Languages size={14} />
              </div>
              <h3 className="text-sm font-bold text-ctp-text uppercase tracking-wide">Display Language</h3>
            </div>
            <p className="text-xs text-ctp-subtext1 font-medium ml-9">Choose your preferred language for the interface.</p>
          </div>
          <SortDropdown 
            label="Language:" 
            value={lang} 
            onChange={setLang} 
            options={langOptions} 
            className="w-full md:w-auto"
          />
        </div>
        
        <div className="pt-10 border-t border-ctp-surface1 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800">
                <Calendar size={14} />
              </div>
              <h3 className="text-sm font-bold text-ctp-text uppercase tracking-wide">Date Format</h3>
            </div>
            <p className="text-xs text-ctp-subtext1 font-medium ml-9">Choose how dates are displayed across the platform.</p>
          </div>
          <SortDropdown 
            label="Format:" 
            value={format} 
            onChange={setFormat} 
            options={formatOptions} 
            className="w-full md:w-auto"
          />
        </div>
      </div>
    </Card>
  );
}

/**
 * Appearance settings for theme customization.
 */
function AppearanceSection() {
  const { setTheme, actualTheme } = useTheme();

  const themes = [
    { id: 'light', label: 'Latte', icon: Sun, description: 'Light Mode', accent: 'bg-ctp-latte-sky' },
    { id: 'dark', label: 'Mocha', icon: Moon, description: 'Dark Mode', accent: 'bg-ctp-sky-800' },
    { id: 'system', label: 'System', icon: Monitor, description: 'OS Default', accent: 'bg-ctp-subtext1' }
  ];

  return (
    <Card title="Appearance" background="base" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="space-y-8">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ctp-text uppercase tracking-wide">Interface Theme</h3>
          <p className="text-xs text-ctp-subtext1 font-medium">Choose how AyosDocs looks on your device.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left flex flex-col gap-4 ${
                actualTheme === t.id 
                  ? 'border-ctp-sky-800 bg-ctp-sky-800/[0.03] ring-4 ring-ctp-sky-800/5' 
                  : 'border-ctp-surface1 hover:border-ctp-surface2 bg-ctp-mantle'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                actualTheme === t.id ? 'bg-ctp-sky-800 text-white shadow-lg shadow-ctp-sky-800/30' : 'bg-ctp-surface0 text-ctp-subtext1 group-hover:text-ctp-text'
              }`}>
                <t.icon size={22} />
              </div>
              
              <div>
                <p className="text-sm font-bold text-ctp-text tracking-tight uppercase">{t.label}</p>
                <p className="text-[10px] text-ctp-subtext1 font-bold uppercase tracking-widest">{t.description}</p>
              </div>

              {actualTheme === t.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 rounded-full bg-ctp-sky-800 animate-pulse" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Notifications settings.
 */
function NotificationsSection() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  return (
    <Card title="Notifications" background="base" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="space-y-10">
        <Switch
          checked={emailUpdates}
          onChange={setEmailUpdates}
          label="Email Updates"
          description="Get notified about guide updates and new features."
        />
        <div className="pt-10 border-t border-ctp-surface1">
          <Switch
            checked={securityAlerts}
            onChange={setSecurityAlerts}
            label="Security Alerts"
            description="Receive alerts about new sign-ins or password changes."
          />
        </div>
      </div>
    </Card>
  );
}

/**
 * Privacy and security settings.
 */
function PrivacySection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <Card title="Privacy & Security" background="base">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-ctp-text uppercase tracking-wide">Profile Visibility</h3>
              <p className="text-xs text-ctp-subtext1 font-medium">Your progress is currently private to your account.</p>
            </div>
            <Badge variant="sky" className="px-4 py-1.5">Private Account</Badge>
          </div>
          
          <div className="pt-8 border-t border-ctp-surface1 flex items-center justify-between">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-ctp-text uppercase tracking-wide">Activity Logs</h3>
              <p className="text-xs text-ctp-subtext1 font-medium">View your recent login activity and security events.</p>
            </div>
            <Button variant="secondary" size="sm" className="font-bold text-[10px] uppercase tracking-widest">
              View Logs
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Danger Zone" background="mantle" className="border-ctp-red/20">
        <div className="space-y-6">
           <div className="flex items-center gap-3 text-ctp-red">
             <div className="p-2 rounded-lg bg-ctp-red/10">
               <ShieldAlert size={18} />
             </div>
             <h3 className="text-sm font-bold uppercase tracking-widest">Account Deletion</h3>
           </div>
           <p className="text-xs text-ctp-subtext1 leading-relaxed font-medium">
             Deleting your account will permanently remove all your saved progress, favorites, and tracked bundles. This action is irreversible and all data will be purged within 30 days.
           </p>
           <div className="pt-4">
             <Button variant="outline" className="border-ctp-red/30 text-ctp-red hover:bg-ctp-red hover:text-white hover:border-ctp-red w-full md:w-auto transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.2em]" leftIcon={<Trash2 size={14} />}>
               Delete AyosDocs Account
             </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Handles password management UI logic based on account type.
 */
function PasswordSection({ user, showToast }) {
  const isGoogleOnly = user?.googleAuth && !user?.hasPassword;

  if (isGoogleOnly) {
    return (
      <Card title="Password Management" background="base" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
        <div className="flex flex-col items-center text-center space-y-8 py-10">
          <div className="w-20 h-20 rounded-3xl bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 shadow-inner">
            <Shield size={40} />
          </div>
          <div className="space-y-3 max-w-md">
            <h3 className="text-xl font-bold text-ctp-text uppercase tracking-tight">Managed by Google</h3>
            <p className="text-sm text-ctp-subtext1 leading-relaxed font-medium">
              Your account is secured via Google OAuth. To manage your password or security settings, please visit your Google Account preferences.
            </p>
          </div>
          
          <div className="w-full max-w-sm bg-ctp-mantle border border-ctp-surface1 rounded-2xl p-8 text-left shadow-sm">
            <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] mb-5 border-b border-ctp-surface1 pb-3">Security Provider Details</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ctp-subtext1 uppercase">Method</span>
                <span className="text-xs font-bold text-ctp-sky-800">Google OAuth 2.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ctp-subtext1 uppercase">Status</span>
                <Badge variant="green" className="text-[9px]">Active & Secure</Badge>
              </div>
            </div>
            <button 
              onClick={() => window.open('https://myaccount.google.com/security', '_blank')}
              className="mt-8 w-full py-3 bg-ctp-base border border-ctp-surface1 rounded-xl text-[10px] font-bold uppercase tracking-widest text-ctp-text hover:border-ctp-sky-800 hover:text-ctp-sky-800 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Manage Google Account</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return <ChangePasswordForm showToast={showToast} />;
}

/**
 * Standard password change form for Email and Hybrid users.
 */
function ChangePasswordForm({ showToast }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFieldError = (name) => {
    if (name === 'currentPassword' && error.includes('current password')) return error;
    if (name === 'newPassword') {
      if (formData.newPassword && formData.newPassword.length < 8) return 'Password must be at least 8 characters';
      if (formData.newPassword && formData.newPassword === formData.currentPassword) return 'New password must be different from current';
      if (error.includes('different from your current')) return error;
    }
    if (name === 'confirmPassword' && formData.confirmPassword && formData.confirmPassword !== formData.newPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const isFormValid = () => {
    return (
      formData.currentPassword.length > 0 &&
      formData.newPassword.length >= 8 &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword !== formData.currentPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await changePasswordAction(formData.currentPassword, formData.newPassword);
      if (result.success) {
        setIsSuccess(true);
        showToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your security credentials have been updated successfully.'
        });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card title="Change Password" background="base" className="animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center space-y-8 py-16">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shadow-2xl shadow-green-500/20 ring-4 ring-green-500/5">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-3 max-w-md">
            <h3 className="text-2xl font-bold text-ctp-text uppercase tracking-tight">Update Successful</h3>
            <p className="text-sm text-ctp-subtext1 leading-relaxed font-medium">
              Your password has been securely updated. We&apos;ve synchronized your credentials across all platforms.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setIsSuccess(false)} className="px-10 font-bold uppercase tracking-widest text-[10px]">
            Return to Settings
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Change Password" 
      headerAction={<Badge variant="sky" className="text-[9px] uppercase tracking-widest">Secure Area</Badge>}
      footer={
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ctp-mantle flex items-center justify-center text-ctp-subtext1 border border-ctp-surface1 shrink-0">
              <Shield size={14} />
            </div>
            <p className="text-[10px] text-ctp-subtext1 max-w-xs leading-relaxed font-bold uppercase tracking-wide">
              Security Notice: You will be signed out of all other devices upon completion.
            </p>
          </div>
          <Button
            type="submit"
            form="change-password-form"
            disabled={isSubmitting || !isFormValid()}
            isLoading={isSubmitting}
            className="px-10 font-bold text-[11px] uppercase tracking-[0.2em]"
          >
            Update Credentials
          </Button>
        </div>
      }
      className="animate-in fade-in slide-in-from-bottom-3 duration-500"
    >
      <form id="change-password-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <Input
          label="Current Security Key"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          placeholder="Enter current password"
          error={getFieldError('currentPassword')}
          leftIcon={Lock}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Min. 8 characters"
            error={getFieldError('newPassword')}
            leftIcon={Lock}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Repeat new password"
            error={getFieldError('confirmPassword')}
            leftIcon={Lock}
            required
          />
        </div>
      </form>
    </Card>
  );
}

/**
 * Reusable placeholder for other settings sections.
 */
function PlaceholderSection({ title, icon: Icon }) {
  return (
    <Card title={title} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="py-24 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1 shadow-inner relative overflow-hidden">
          <Icon size={32} className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-tr from-ctp-sky-800/5 to-transparent" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold text-ctp-text uppercase tracking-[0.2em]">Under Construction</p>
          <p className="text-xs text-ctp-subtext1 font-medium max-w-xs mx-auto leading-relaxed">
            We&apos;re building something great. This settings module will be available in the next platform update.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/updates'} className="font-bold text-[10px] uppercase tracking-widest">
          View Roadmap
        </Button>
      </div>
    </Card>
  );
}
