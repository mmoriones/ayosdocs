import Navbar from '../features/navigation/components/Navbar';
import ScrollToTop from '../features/navigation/components/ScrollToTop';
import Footer from '../components/Footer';
import AuthModal from '../features/auth/components/AuthModal';
import MobileMenu from '../features/navigation/components/MobileMenu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const MainLayout = ({ children }) => {
  const { 
    isAuthModalOpen, closeAuthModal, 
    isMobileMenuOpen, toggleMobileMenu,
    user, logout, openAuthModal 
  } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    navigate("/");
    localStorage.removeItem("lastGuideSlug");
    showToast({
      type: 'success',
      title: 'Logged Out',
      message: 'You have been successfully logged out.'
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50">
      <ScrollToTop />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        closeMenu={() => toggleMobileMenu(false)}
        user={user}
        openAuthModal={openAuthModal}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default MainLayout;
