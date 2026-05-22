'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Globe, Lock, Palette, Smartphone, Shield, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { changePasswordAction } from '@/app/actions/user';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

/**
 * Settings client page with interactive tab management and security features.
 */
export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState('General');
  const { data: session } = useSession();
  const { showToast } = useToast();
  const user = session?.user;

  const tabs = [
    { label: 'General', icon: Globe },
    { label: 'Appearance', icon: Palette },
    { label: 'Notifications', icon: Bell },
    { label: 'Privacy & Security', icon: Shield },
    { label: 'Sessions', icon: Smartphone },
    { label: 'Password', icon: Lock },
  ];

  return (
    <div className="bg-ctp-base font-sans text-ctp-text min-h-screen pb-20">
      {/* Header */}
      <div className="px-6 lg:px-10 py-8 border-b border-ctp-surface1 bg-ctp-mantle/50">
        <div className="max-w-[1600px] mx-auto">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ctp-text">Settings</h1>
            <p className="text-sm text-ctp-subtext1">Configure your workspace and privacy preferences.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === item.label 
                      ? 'bg-ctp-sky-800/10 text-ctp-sky-800' 
                      : 'text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'Password' ? (
              <PasswordSection user={user} showToast={showToast} />
            ) : (
              <PlaceholderSection title={`${activeTab} Settings`} />
            )}
          </div>
        </div>
      </div>
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
      <Card title="Password Management" background="base" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col items-center text-center space-y-6 py-4">
          <div className="w-16 h-16 rounded-2xl bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 shadow-inner">
            <Shield size={32} />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-bold text-ctp-text">Managed by Google</h3>
            <p className="text-sm text-ctp-subtext1 leading-relaxed">
              Your account is secured via Google OAuth. To manage your password or security settings, please visit your Google Account preferences.
            </p>
          </div>
          
          <div className="w-full max-w-sm bg-ctp-mantle border border-ctp-surface1 rounded-xl p-6 text-left">
            <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-4">How to manage security</p>
            <div className="flex items-center gap-3 text-xs font-bold text-ctp-text">
              <span>Google Account</span>
              <ChevronRight size={14} className="text-ctp-surface2" />
              <span>Security</span>
              <ChevronRight size={14} className="text-ctp-surface2" />
              <span className="text-ctp-sky-800">Signing in to Google</span>
            </div>
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
      <Card title="Change Password" background="base" className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center space-y-6 py-12">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shadow-xl shadow-green-500/5">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-bold text-ctp-text">Successfully Changed</h3>
            <p className="text-sm text-ctp-subtext1 leading-relaxed">
              Your password has been updated. You can continue managing your other account settings.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setIsSuccess(false)}>
            Close and return
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Change Password" 
      headerAction={<span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest bg-ctp-surface0 px-2.5 py-1 rounded-full border border-ctp-surface1">Secure Action</span>}
      footer={
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-xs text-ctp-subtext1 max-w-sm leading-relaxed">
            Changing your password will sign you out of all other active sessions for your protection.
          </p>
          <Button
            type="submit"
            form="change-password-form"
            disabled={isSubmitting || !isFormValid()}
            isLoading={isSubmitting}
            className="px-8"
          >
            Save New Password
          </Button>
        </div>
      }
      className="animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <form id="change-password-form" onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          placeholder="Enter current password"
          error={getFieldError('currentPassword')}
          leftIcon={Lock}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="At least 8 characters"
            error={getFieldError('newPassword')}
            leftIcon={Lock}
            required
          />

          <Input
            label="Confirm Password"
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
function PlaceholderSection({ title }) {
  return (
    <Card title={title} className="animate-in fade-in duration-300">
      <div className="p-20 flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-ctp-surface0 flex items-center justify-center text-ctp-subtext1">
          <Smartphone size={20} />
        </div>
        <p className="text-sm font-bold text-ctp-subtext1 uppercase tracking-widest">Under Construction</p>
        <p className="text-xs text-ctp-subtext0 max-w-xs mx-auto">This settings section is coming soon in a future update.</p>
      </div>
    </Card>
  );
}
