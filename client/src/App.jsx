import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Guide from './pages/Guide';
import Home from './pages/Home';
import UserProgress from './pages/UserProgress';
import Verified from './pages/Verifed';
import About from './pages/info/About';
import Contact from './pages/info/Contact';
import FAQs from './pages/info/FAQs';
import Privacy from './pages/info/Privacy';
import Terms from './pages/info/Terms';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guides/:slug" element={<Guide />} />
            <Route path="/my-progress" element={<UserProgress />} />
            <Route path="/verified" element={<Verified />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
