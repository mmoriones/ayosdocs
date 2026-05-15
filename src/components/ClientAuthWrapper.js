'use client';

import { useAuthUI } from "@/components/Providers";
import AuthModal from "@/features/auth/components/AuthModal";
import MobileMenu from "@/features/navigation/components/MobileMenu";

export default function ClientAuthWrapper() {
  const { isAuthModalOpen, closeAuthModal } = useAuthUI();

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
      <MobileMenu />
    </>
  );
}
