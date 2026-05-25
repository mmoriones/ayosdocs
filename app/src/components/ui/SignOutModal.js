'use client';

import { signOut } from 'next-auth/react';
import ConfirmModal from '@/components/ConfirmModal';

const SignOutModal = ({ isOpen, onClose, callbackUrl = '/', onSignOut }) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        onSignOut?.();
        signOut({ callbackUrl });
      }}
      title="Sign out?"
      message="Are you sure you want to sign out of your account?"
      confirmText="Sign Out"
      variant="warning"
    />
  );
};

export default SignOutModal;
