import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GuideDetail from './pages/GuideDetail';
import Home from './pages/Home';
import Footer from './components/Footer';


function App() {
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#1a1c1e]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
        </Routes>
        <Footer />
      </div>

    </Router>
  );
}

export default App;