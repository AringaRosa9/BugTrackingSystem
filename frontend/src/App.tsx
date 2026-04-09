import React, { useEffect, useMemo, useState } from 'react';
import { Bug } from './types/bug';
import BugDetailPage from './components/bug-detail/BugDetailPage';
import AppShell from './components/layout/AppShell';
import DashboardPage from './components/dashboard/DashboardPage';
import BugListPage from './components/bug-list/BugListPage';
import SettingsPage from './components/settings/SettingsPage';
import InsightsPage from './components/insights/InsightsPage';
import ResolutionArchive from './components/archive/ResolutionArchive';
import { fetchBugs, patchBug } from './services/bugApi';

export default function App() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedBug = useMemo(
    () => bugs.find((bug) => bug.bugId === selectedBugId) || null,
    [bugs, selectedBugId],
  );

  useEffect(() => {
    let isMounted = true;

    const loadBugs = async (showLoading = false) => {
      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const nextBugs = await fetchBugs();
        if (!isMounted) {
          return;
        }

        setBugs(nextBugs);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load bugs');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBugs(true);
    const pollId = window.setInterval(() => {
      void loadBugs(false);
    }, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(pollId);
    };
  }, []);

  const handleUpdateBug = async (updatedBug: Bug) => {
    const previousBug = bugs.find((bug) => bug.bugId === updatedBug.bugId);
    if (!previousBug) {
      return;
    }

    setBugs((currentBugs) => currentBugs.map((bug) => bug.bugId === updatedBug.bugId ? updatedBug : bug));
    setSelectedBugId(updatedBug.bugId);

    const patch: Partial<Bug> = {};
    if (updatedBug.status !== previousBug.status) {
      patch.status = updatedBug.status;
    }
    if (updatedBug.assignee !== previousBug.assignee) {
      patch.assignee = updatedBug.assignee;
    }
    if (updatedBug.priority !== previousBug.priority) {
      patch.priority = updatedBug.priority;
    }
    if (updatedBug.title !== previousBug.title) {
      patch.title = updatedBug.title;
    }
    if (updatedBug.description !== previousBug.description) {
      patch.description = updatedBug.description;
    }

    if (Object.keys(patch).length === 0) {
      return;
    }

    try {
      const savedBug = await patchBug(updatedBug.bugId, patch);
      setBugs((currentBugs) => currentBugs.map((bug) => bug.bugId === savedBug.bugId ? savedBug : bug));
    } catch (error) {
      setBugs((currentBugs) => currentBugs.map((bug) => bug.bugId === previousBug.bugId ? previousBug : bug));
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update bug');
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedBugId(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-sm text-gray-500">
            正在加载缺陷数据...
          </div>
        </div>
      );
    }

    if (selectedBug) {
      return (
        <BugDetailPage 
          bug={selectedBug} 
          onBack={() => setSelectedBugId(null)} 
          onUpdateBug={handleUpdateBug}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardPage 
            bugs={bugs} 
            onSelectBug={(bug) => setSelectedBugId(bug.bugId)} 
            onViewAll={() => handleNavigate('all_bugs')} 
          />
        );
      case 'all_bugs':
        return (
          <BugListPage 
            bugs={bugs} 
            onSelectBug={(bug) => setSelectedBugId(bug.bugId)} 
          />
        );
      case 'archive':
        return <ResolutionArchive bugs={bugs} />;
      case 'insights':
        return <InsightsPage bugs={bugs} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <AppShell currentView={currentView} onNavigate={handleNavigate}>
      {errorMessage && (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        </div>
      )}
      {renderContent()}
    </AppShell>
  );
}
