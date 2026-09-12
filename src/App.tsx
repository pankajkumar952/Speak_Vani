import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider } from './context/AppStateContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Watermark } from './components/ui/Watermark';

import { Landing } from './pages/Landing';
import { Categories } from './pages/Categories';
import { Spinner } from './pages/Spinner';
import { Topic } from './pages/Topic';
import { Practice } from './pages/Practice';
import { Result } from './pages/Result';
import { KidsAgeSelect } from './pages/KidsAgeSelect';
import { Challenges } from './pages/Challenges';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isFullScreenCamera = location.pathname === '/practice';

  if (isFullScreenCamera) {
    return (
      <>
        {children}
        <Watermark />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col selection:bg-[#0d9488] selection:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <Footer />
      <Watermark />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/kids" element={<KidsAgeSelect />} />
              <Route path="/kids/age" element={<KidsAgeSelect />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/spinner" element={<Spinner />} />
              <Route path="/topic" element={<Topic />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/result" element={<Result />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
