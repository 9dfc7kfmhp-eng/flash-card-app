import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FlashcardProvider, SessionProvider } from './context';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { MigrationPanel } from './components/MigrationPanel';
import {
  Dashboard,
  CardManagement,
  LearnMode,
  QuizMultipleChoice,
  QuizFillBlank,
  Statistics,
  NotFound,
} from './pages';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <FlashcardProvider>
        <SessionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="cards" element={<CardManagement />} />
                <Route path="learn" element={<LearnMode />} />
                <Route
                  path="quiz/multiple-choice"
                  element={<QuizMultipleChoice />}
                />
                <Route path="quiz/fill-blank" element={<QuizFillBlank />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <MigrationPanel />
        </SessionProvider>
      </FlashcardProvider>
    </ErrorBoundary>
  );
}

export default App;
