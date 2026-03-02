import { useState, useEffect } from 'react';
import { useFilters } from '../../context/FilterContext';
import CompetenceLevelsChart from '../charts/CompetenceLevelsChart';
import ItemStatisticsChart from '../charts/ItemStatisticsChart';
import AggregationsView from '../charts/AggregationsView';
import EducationalMaterialsPanel from '../charts/EducationalMaterialsPanel';
import StudentsPanel from '../charts/StudentsPanel';

const Dashboard = () => {
  const { selectedLevel, getSelectedId } = useFilters();

  // Get initial tab from URL
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'competence';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab]);

  const tabs = [
    { id: 'competence', label: 'Kompetenzstufen', icon: '📊' },
    { id: 'items', label: 'Item-Statistiken', icon: '📈' },
    { id: 'aggregations', label: 'Aggregationen', icon: '📉' },
    { id: 'students', label: 'Schüler*innen', icon: '👥' },
    { id: 'materials', label: 'Lernmaterialien', icon: '📚' },
  ];

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'competence' && (
            <CompetenceLevelsChart level={selectedLevel} id={getSelectedId()} />
          )}

          {activeTab === 'items' && (
            <ItemStatisticsChart level={selectedLevel} id={getSelectedId()} />
          )}

          {activeTab === 'aggregations' && (
            <AggregationsView level={selectedLevel} id={getSelectedId()} />
          )}

          {activeTab === 'students' && (
            <StudentsPanel
              onNavigateMaterials={(groupId) => {
                setActiveTab('materials');
                // Store the target custom group so the materials panel can pre-select it
                sessionStorage.setItem('tba3_navigate_custom_group', groupId);
              }}
            />
          )}

          {activeTab === 'materials' && (
            <EducationalMaterialsPanel />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
