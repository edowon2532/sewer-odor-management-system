import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdMap, MdWarning, MdBuild, MdAssessment, MdSettings, MdNotifications } from 'react-icons/md';
import Dashboard from './components/Dashboard';
import OdorMap from './components/Odormap';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import ComplaintManagement from './components/ComplaintManagement';
import FacilityManagement from './components/FacilityManagement';
import Statistics from './components/Statistics';
import Settings from './components/Settings';

const menuItems = [
  { path: '/', icon: <MdDashboard />, label: '대시보드', component: Dashboard },
  { path: '/odor-map', icon: <MdMap />, label: '악취지도', component: OdorMap },
  { path: '/monitoring', icon: <MdNotifications />, label: '실시간 모니터링', component: RealTimeMonitoring },
  { path: '/complaints', icon: <MdWarning />, label: '민원관리', component: ComplaintManagement },
  { path: '/facilities', icon: <MdBuild />, label: '시설관리', component: FacilityManagement },
  { path: '/statistics', icon: <MdAssessment />, label: '통계분석', component: Statistics },
  { path: '/settings', icon: <MdSettings />, label: '설정', component: Settings }
];

function MainContent() {
  const location = useLocation();
  // 대시보드, 악취지도는 패딩 없음, 나머지는 p-6
  const noPadding = location.pathname === '/' || location.pathname === '/odor-map';
  return (
    <main className={`flex-1 overflow-hidden${noPadding ? '' : ' p-6'}`}>
      <Routes>
        {menuItems.map((item) => (
          <Route key={item.path} path={item.path} element={<item.component />} />
        ))}
      </Routes>
    </main>
  );
}

const App = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-teal-600 text-white p-4 flex items-center">
          <button
            onClick={() => {
              if (window.innerWidth < 768) setIsMobileMenuOpen(true);
              else setIsMenuExpanded(!isMenuExpanded);
            }}
            className="mr-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">스마트 하수악취 통합관리시스템</h1>
        </header>

        {/* 모바일 메뉴 드로어 */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setIsMobileMenuOpen(false)} />
            <nav className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 shadow-lg transform transition-transform duration-300 translate-x-0">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <span className="text-lg font-bold">메뉴</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-2 p-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center p-2 rounded hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}

        <div className="flex flex-1 overflow-hidden">
          <nav className={`hidden md:block ${isMenuExpanded ? 'w-64' : 'w-16'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
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

          <MainContent />
        </div>
      </div>
    </Router>
  );
};

export default App;