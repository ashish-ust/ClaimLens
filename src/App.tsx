import { Link, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorState from './components/ErrorState';
import Header from './components/Header';
import ClaimsPage from './pages/ClaimsPage';
import ReviewPage from './pages/ReviewPage';
import UploadPage from './pages/UploadPage';

export default function App() {
  const location = useLocation();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Keyed by path so a crash on one page does not block navigating to another. */}
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/review/:analysisId" element={<ReviewPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route
              path="*"
              element={
                <div className="container page">
                  <ErrorState info={{ title: 'Page not found', message: 'That page does not exist.' }}>
                    <Link to="/" className="button button-primary">
                      Go to new claim
                    </Link>
                  </ErrorState>
                </div>
              }
            />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  );
}
