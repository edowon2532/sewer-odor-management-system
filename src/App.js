import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MdDashboard, MdMap, MdWarning, MdBuild, MdAssessment, MdSettings, MdNotifications } from 'react-icons/md';
import Dashboard from './components/Dashboard';
import OdorMap from './components/OdorMap';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import ComplaintManagement from './components/ComplaintManagement';
import FacilityManagement from './components/FacilityManagement';
import Statistics from './components/Statistics';
import Settings from './components/Settings';

const App = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const menuItems = [
    { path: '/', icon: <MdDashboard />, label: '대시보드', component: Dashboard },
    { path: '/odor-map', icon: <MdMap />, label: '악취지도', component: OdorMap },
    { path: '/monitoring', icon: <MdNotifications />, label: '실시간 모니터링', component: RealTimeMonitoring },
    { path: '/complaints', icon: <MdWarning />, label: '민원관리', component: ComplaintManagement },
    { path: '/facilities', icon: <MdBuild />, label: '시설관리', component: FacilityManagement },
    { path: '/statistics', icon: <MdAssessment />, label: '통계분석', component: Statistics },
    { path: '/settings', icon: <MdSettings />, label: '설정', component: Settings }
  ];

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-teal-600 text-white p-4 flex items-center">
          <button
            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
            className="mr-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">스마트 하수악취 통합관리시스템</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <nav className={`${isMenuExpanded ? 'w-64' : 'w-16'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
            <div className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center p-2 rounded hover:bg-gray-700"
                    >
                      <span className="text-xl">{item.icon}</span>
                      {isMenuExpanded && <span className="ml-3">{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="flex-1 p-6 overflow-hidden">
            <Routes>
              {menuItems.map((item) => (
                <Route key={item.path} path={item.path} element={<item.component />} />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;