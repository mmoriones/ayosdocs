'use client';

import { useAuthUI } from "@/components/Providers";
import AuthModal from "@/features/auth/components/AuthModal";

export default function ClientAuthWrapper() {
  const { isAuthModalOpen, closeAuthModal } = useAuthUI();

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
}
