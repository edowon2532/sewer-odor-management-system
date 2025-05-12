import React from 'react';

// 더미 컴포넌트들
const Sidebar = () => (
  <aside className="w-64 bg-[#232A36] text-white flex flex-col h-full shadow-xl rounded-tr-3xl rounded-br-3xl">
    <div className="h-20 flex items-center justify-center text-2xl font-bold tracking-wide border-b border-gray-700">하수악취<br/>통합관리</div>
    <nav className="flex-1 py-6 space-y-2 px-4">
      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#2563eb]/20 transition font-semibold"><span>📊</span>대시보드</button>
      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#2563eb]/20 transition font-semibold"><span>🗺️</span>악취지도</button>
      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#2563eb]/20 transition font-semibold"><span>⏱️</span>실시간 모니터링</button>
      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#2563eb]/20 transition font-semibold"><span>📋</span>민원관리</button>
      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#2563eb]/20 transition font-semibold"><span>📈</span>통계분석</button>
      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#2563eb]/20 transition font-semibold"><span>⚙️</span>설정</button>
    </nav>
    <div className="p-4 text-xs text-gray-400">© 2024 Sewer Odor System</div>
  </aside>
);

const TopNav = () => (
  <header className="h-16 flex items-center px-8 bg-white/10 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20">
    <div className="flex gap-2">
      <button className="px-4 py-2 rounded-full bg-[#2563eb] text-white font-bold shadow">하수악취</button>
      <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-[#22d3ee]/30 transition">측정소</button>
      <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-[#22d3ee]/30 transition">배관망</button>
      <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-[#22d3ee]/30 transition">시설제어</button>
    </div>
    <div className="ml-auto flex items-center gap-4">
      <input className="rounded-full px-4 py-1 bg-gray-100 text-sm focus:outline-none" placeholder="검색..." />
      <button className="rounded-full w-9 h-9 bg-gray-700 text-white flex items-center justify-center">👤</button>
    </div>
  </header>
);

const DummyCard = ({ title, children }) => (
  <div className="rounded-2xl bg-[#232A36] shadow-xl p-4 mb-4 min-h-[120px]">
    <div className="font-bold text-lg mb-2 text-white/90">{title}</div>
    {children || <div className="text-gray-400">(그래프/내용 영역)</div>}
  </div>
);

const MapPanel = () => (
  <div className="rounded-2xl bg-[#232A36] shadow-xl p-4 h-full flex flex-col">
    <div className="font-bold text-lg mb-2 text-white/90">지도 패널</div>
    <div className="flex-1 bg-gray-900/40 rounded-xl flex items-center justify-center text-gray-400">(지도 영역)</div>
  </div>
);

const DashboardLayout = () => (
  <div className="flex h-screen bg-[#181C24]">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <TopNav />
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-auto">
        {/* 좌측 카드 */}
        <div className="col-span-3 flex flex-col">
          <DummyCard title="상태 요약" />
          <DummyCard title="바람장" />
          <DummyCard title="측정소별 H₂S" />
        </div>
        {/* 지도 */}
        <div className="col-span-6 flex flex-col">
          <MapPanel />
        </div>
        {/* 우측 카드 */}
        <div className="col-span-3 flex flex-col">
          <DummyCard title="시설/장치 제어" />
          <DummyCard title="24시간 통계" />
          <DummyCard title="센서 작동 현황" />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardLayout; 