'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Bell, 
  User, 
  ShieldCheck, 
  Bell as BellIcon, 
  Moon, 
  Globe, 
  Lock, 
  HelpCircle, 
  FileText, 
  Info,
  ChevronRight,
  LogOut,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Shield,
  ShieldAlert
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/context';
import { Card, Button, SignOutModal, Modal, Input, Badge } from '@/components/ui';
import { changePasswordAction, deleteAccountAction } from '@/app/actions/user';

/**
 * Redesigned Settings client page following the new mobile-first aesthetics.
 */
export default function SettingsClient() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'security', 'notifications', 'privacy', 'password'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const user = session?.user;
  const isGoogleLinked = user?.googleAuth;

  const viewTitles = {
    security: 'Security',
    notifications: 'Notifications',
    privacy: 'Privacy',
    password: 'Change Password',
  };

  const renderActiveSection = () => {
    switch (currentView) {
      case 'security':
        return <SecuritySection user={user} onPasswordClick={() => setCurrentView('password')} onDeleteClick={() => setShowDeleteConfirm(true)} />;
      case 'notifications':
        return <NotificationsSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'password':
        return <PasswordSection user={user} showToast={showToast} onBack={() => setCurrentView('security')} />;
      default:
        return (
          <div className="max-w-md lg:max-w-[1200px] mx-auto px-6 lg:px-10 space-y-8 animate-in fade-in duration-500">
            {/* ACCOUNT Section */}
            <section className="space-y-3">
              <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Account</h3>
              <Card className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl" noPadding>
                <SettingsItem 
                  icon={<User size={20} className="text-[#007AFF]" />} 
                  label="Personal Information" 
                  onClick={() => router.push('/profile')}
                />
                <SettingsItem 
                  icon={<ShieldCheck size={20} className="text-[#007AFF]" />} 
                  label="Security" 
                  rightElement={
                    isGoogleLinked && (
                      <div className="flex items-center gap-1.5 mr-1">
                        <Image 
                          src="https://www.svgrepo.com/show/475656/google-color.svg" 
                          alt="Google" 
                          width={14} 
                          height={14} 
                        />
                        <span className="text-[13px] font-medium text-gray-500">Google Linked</span>
                      </div>
                    )
                  }
                  onClick={() => setCurrentView('security')}
                />
                <SettingsItem 
                  icon={<BellIcon size={20} className="text-[#007AFF]" />} 
                  label="Notification Preferences" 
                  isLast
                  onClick={() => setCurrentView('notifications')}
                />
              </Card>
            </section>

            {/* PREFERENCES Section */}
            <section className="space-y-3">
              <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Preferences</h3>
              <Card className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl" noPadding>
                <SettingsItem 
                  icon={<Moon size={20} className="text-[#007AFF]" />} 
                  label="Theme" 
                  rightElement={
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Coming Soon</span>
                  }
                  hideChevron
                />
                <SettingsItem 
                  icon={<Globe size={20} className="text-[#007AFF]" />} 
                  label="Language" 
                  rightElement={<span className="text-[13px] font-medium text-gray-500 mr-1">English</span>}
                  onClick={() => {}}
                />
                <SettingsItem 
                  icon={<Lock size={20} className="text-[#007AFF]" />} 
                  label="Privacy Settings" 
                  isLast
                  onClick={() => setCurrentView('privacy')}
                />
              </Card>
            </section>

            {/* SUPPORT Section */}
            <section className="space-y-3">
              <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Support</h3>
              <Card className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl" noPadding>
                <SettingsItem icon={<HelpCircle size={20} className="text-[#007AFF]" />} label="Help Center" onClick={() => router.push('/faqs')} />
                <SettingsItem icon={<Shield size={20} className="text-[#007AFF]" />} label="Privacy Policy" onClick={() => router.push('/privacy')} />
                <SettingsItem icon={<FileText size={20} className="text-[#007AFF]" />} label="Terms of Service" onClick={() => router.push('/terms')} />
                <SettingsItem icon={<Info size={20} className="text-[#007AFF]" />} label="About AyosDocs" isLast onClick={() => router.push('/about')} />
              </Card>
            </section>

            {/* Sign Out Button */}
            <Button 
              variant="secondary"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full !p-5 !rounded-[24px] !bg-white/80 !backdrop-blur-md !border-white/60"
            >
              <span className="text-[17px] font-bold text-[#FF3B30]">Sign Out</span>
            </Button>

            {/* Version */}
            <div className="text-center pb-8">
              <p className="text-[13px] font-medium text-gray-400">AyosDocs v1.0.4</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-ios-gradient animate-in fade-in duration-700">
      {/* Header */}
      <div className="px-6 mb-8 pt-10">
        {currentView === 'menu' ? (
          <h1 className="text-[34px] font-bold tracking-tight text-[#1C1C1E]">Settings</h1>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('menu')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
            >
              <ChevronLeft size={24} className="text-[#1C1C1E]" strokeWidth={2.5} />
            </button>
            <h1 className="text-[28px] font-bold tracking-tight text-[#1C1C1E]">{viewTitles[currentView]}</h1>
          </div>
        )}
      </div>

      {renderActiveSection()}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        size="sm"
        contentClassName="!rounded-[32px] overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#FF3B30]">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C1C1E]">Delete Account</h3>
              <p className="text-sm text-gray-500 font-medium">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Are you sure you want to delete your account? You have 30 days to change your mind.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              variant="danger"
              onClick={async () => {
                setDeleting(true);
                const result = await deleteAccountAction();
                setDeleting(false);
                setShowDeleteConfirm(false);
                if (result.success) {
                  showToast({
                    type: 'success',
                    title: 'Scheduled',
                    message: 'Your account will be deleted in 30 days.'
                  });
                  setTimeout(() => signOut({ redirect: true, callbackUrl: '/' }), 2000);
                } else {
                  showToast({ type: 'error', title: 'Error', message: result.message });
                }
              }}
              disabled={deleting}
              className="w-full h-14 !rounded-[20px] text-[15px] font-bold"
            >
              {deleting ? 'Processing...' : 'Delete My Account'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full h-14 !rounded-[20px] text-[15px] font-bold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <SignOutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

function SettingsItem({ icon, label, rightElement, onClick, isLast, hideChevron }) {
  const isClickable = !!onClick;
  const Component = isClickable ? 'button' : 'div';

  return (
    <Component 
      onClick={onClick}
      type={isClickable ? 'button' : undefined}
      className={`w-full flex items-center justify-between p-4 ${isClickable ? 'active:bg-gray-50/50 cursor-pointer' : ''} transition-colors group ${!isLast ? 'border-b border-gray-100/50' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[15px] font-bold text-[#1C1C1E]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightElement}
        {!hideChevron && <ChevronRight size={18} className="text-gray-300 group-active:text-[#0038A8] transition-all" strokeWidth={2.5} />}
      </div>
    </Component>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#007AFF]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SecuritySection({ user, onPasswordClick, onDeleteClick }) {
  const isGoogleOnly = user?.googleAuth && !user?.hasPassword;

  return (
    <div className="max-w-md lg:max-w-[1200px] mx-auto px-6 lg:px-10 space-y-8 animate-in slide-in-from-right duration-500">
      <section className="space-y-3">
        <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Account Protection</h3>
        <Card className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl" noPadding>
          <SettingsItem 
            icon={<Lock size={20} className="text-[#007AFF]" />} 
            label="Change Password" 
            onClick={isGoogleOnly ? undefined : onPasswordClick}
            rightElement={isGoogleOnly ? <span className="text-[12px] font-medium text-gray-400 mr-1">Google OAuth</span> : null}
            hideChevron={isGoogleOnly}
          />
          <SettingsItem 
            icon={<ShieldCheck size={20} className="text-[#007AFF]" />} 
            label="Two-Factor Authentication" 
            isLast
            rightElement={<span className="text-[12px] font-medium text-gray-400 mr-1">Coming Soon</span>}
            hideChevron
          />
        </Card>
      </section>

      <section className="space-y-3">
        <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Danger Zone</h3>
        <Card className="!rounded-[28px] overflow-hidden border-red-100/60 shadow-sm bg-red-50/30" noPadding>
          <SettingsItem 
            icon={<Trash2 size={20} className="text-[#FF3B30]" />} 
            label="Delete Account" 
            onClick={onDeleteClick}
            isLast
          />
        </Card>
      </section>
    </div>
  );
}

function NotificationsSection() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  return (
    <div className="max-w-md lg:max-w-[1200px] mx-auto px-6 lg:px-10 space-y-8 animate-in slide-in-from-right duration-500">
      <section className="space-y-3">
        <Card className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl" noPadding>
          <SettingsItem 
            icon={<BellIcon size={20} className="text-[#007AFF]" />} 
            label="Email Updates" 
            rightElement={<Switch checked={emailUpdates} onChange={setEmailUpdates} />}
            hideChevron
          />
          <SettingsItem 
            icon={<Shield size={20} className="text-[#007AFF]" />} 
            label="Security Alerts" 
            isLast
            rightElement={<Switch checked={securityAlerts} onChange={setSecurityAlerts} />}
            hideChevron
          />
        </Card>
      </section>
    </div>
  );
}

function PrivacySection() {
  return (
    <div className="max-w-md lg:max-w-[1200px] mx-auto px-6 lg:px-10 space-y-8 animate-in slide-in-from-right duration-500">
      <section className="space-y-3">
        <Card className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl" noPadding>
          <SettingsItem 
            icon={<User size={20} className="text-[#007AFF]" />} 
            label="Profile Visibility" 
            rightElement={<span className="text-[12px] font-medium text-gray-400 mr-1">Private</span>}
            hideChevron
          />
          <SettingsItem 
            icon={<ShieldAlert size={20} className="text-[#007AFF]" />} 
            label="Activity Logs" 
            isLast
          />
        </Card>
      </section>
    </div>
  );
}

function PasswordSection({ user, showToast, onBack }) {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid = formData.currentPassword && formData.newPassword.length >= 8 && formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await changePasswordAction(formData.currentPassword, formData.newPassword);
      if (result.success) {
        setIsSuccess(true);
        showToast({ type: 'success', title: 'Success', message: 'Password updated.' });
      } else {
        showToast({ type: 'error', title: 'Error', message: result.message });
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md lg:max-w-[1200px] mx-auto px-6 lg:px-10 text-center space-y-6 py-12 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-[#34C759] mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold">Password Updated</h3>
        <p className="text-gray-500">Your security credentials have been successfully changed.</p>
        <Button onClick={onBack} variant="secondary" className="w-full h-14 !rounded-[20px]">Return to Security</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md lg:max-w-[1200px] mx-auto px-6 lg:px-10 space-y-6 animate-in slide-in-from-right duration-500">
      <Card className="p-6 !rounded-[28px] border-white/60 bg-white/80 backdrop-blur-xl space-y-6" noPadding>
        <Input
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          onChange={e => setFormData({...formData, currentPassword: e.target.value})}
          leftIcon={Lock}
          required
        />
        <Input
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={e => setFormData({...formData, newPassword: e.target.value})}
          leftIcon={Lock}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          leftIcon={Lock}
          required
        />
      </Card>
      <Button 
        type="submit" 
        disabled={!isFormValid || isSubmitting} 
        isLoading={isSubmitting}
        className="w-full h-14 !rounded-[20px] text-[15px] font-bold"
      >
        Update Password
      </Button>
    </form>
  );
}
