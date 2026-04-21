import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import GuideDetail from './pages/GuideDetail';
import Home from './pages/Home';
import Footer from './components/Footer';
import UserProgress from './pages/UserProgress';


function App() {
  const [activeSlug, setActiveSlug] = useState('getting-started')
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#1a1c1e]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home activeSlug={activeSlug} setActiveSlug={setActiveSlug} />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          <Route path="/my-progress" element={<UserProgress />} />
        </Routes>
        <Footer />
      </div>

    </Router>
  );
}

export default App;