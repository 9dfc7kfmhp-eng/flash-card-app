import {
  StatsSummary,
  LearningStreak,
  QuickActions,
} from '../components/Dashboard';
import { TestPanel } from '../components/TestPanel';
import './Dashboard.css';

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Willkommen zurück! Bereit zum Lernen?</p>
      </div>

      <LearningStreak />
      <StatsSummary />
      <QuickActions />

      {/* Test Panel nur in Development-Modus */}
      {import.meta.env.DEV && <TestPanel />}
    </div>
  );
}
