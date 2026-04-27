import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Guide from './pages/Guide';
import Home from './pages/Home';
import UserProgress from './pages/UserProgress';
import Verified from './pages/Verifed';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [activeSlug, setActiveSlug] = useState('getting-started')
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home activeSlug={activeSlug} setActiveSlug={setActiveSlug} />} />
            <Route path="/guides/:slug" element={<Guide />} />
            <Route path="/my-progress" element={<UserProgress />} />
            <Route path="/verified" element={<Verified />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
