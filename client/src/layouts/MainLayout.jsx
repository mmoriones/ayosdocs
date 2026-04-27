import Navbar from '../features/navigation/components/Navbar';
import ScrollToTop from '../features/navigation/components/ScrollToTop';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50">
      <ScrollToTop />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
