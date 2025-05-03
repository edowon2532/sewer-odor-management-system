import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import OdorMap from './components/OdorMap';
import FacilityManagement from './components/FacilityManagement';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import ComplaintManagement from './components/ComplaintManagement';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import './App.css';

// 메인 컴포넌트
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="text-2xl font-bold">하수도 악취관리 통합시스템</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 메뉴 */}
        <nav className="w-64 bg-gray-800 text-white p-4">
          <ul>
            <li className={`p-2 rounded mb-2 ${activeTab === 'dashboard' ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('dashboard')}>
              <button className="w-full text-left">대시보드</button>
            </li>
            <li className={`p-2 rounded mb-2 ${activeTab === 'odorMap' ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('odorMap')}>
              <button className="w-full text-left">악취지도</button>
            </li>
            <li className={`p-2 rounded mb-2 ${activeTab === 'facilities' ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('facilities')}>
              <button className="w-full text-left">시설관리</button>
            </li>
            <li className={`p-2 rounded mb-2 ${activeTab === 'monitoring' ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('monitoring')}>
              <button className="w-full text-left">실시간 모니터링</button>
            </li>
            <li className={`p-2 rounded mb-2 ${activeTab === 'complaint' ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('complaint')}>
              <button className="w-full text-left">민원관리</button>
            </li>
            <li className={`p-2 rounded mb-2 ${activeTab === 'stats' ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('stats')}>
              <button className="w-full text-left">통계분석</button>
            </li>
            <li className={`p-2 rounded mb-2 ${activeTab === 'settings' ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('settings')}>
              <button className="w-full text-left">설정</button>
            </li>
          </ul>
        </nav>
        
        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'odorMap' && <OdorMap />}
          {activeTab === 'facilities' && <FacilityManagement />}
          {activeTab === 'monitoring' && <RealTimeMonitoring />}
          {activeTab === 'complaint' && <ComplaintManagement />}
          {activeTab === 'stats' && <Statistics />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default App;