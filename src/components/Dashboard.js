import React from 'react';

// 지표 카드 컴포넌트
const MetricCard = ({ title, value, change, period, isPositive = false }) => {
  const changeClass = isPositive 
    ? (change.startsWith('+') ? 'text-red-500' : 'text-green-500') 
    : (change.startsWith('+') ? 'text-green-500' : 'text-red-500');
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <div className="flex items-end mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`ml-2 ${changeClass}`}>{change}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{period}</p>
    </div>
  );
};

// 대시보드 컴포넌트
const Dashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">악취관리 현황</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <MetricCard title="악취 발생 건수" value="23" change="+2" period="지난 주 대비" />
        <MetricCard title="악취 평균 등급" value="2.4" change="-0.3" period="지난 주 대비" isPositive={true} />
        <MetricCard title="민원 접수 건수" value="8" change="-3" period="지난 주 대비" isPositive={true} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">실시간 악취 모니터링 현황</h3>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">실시간 악취 측정 그래프</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">악취 등급별 분포</h3>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">등급별 분포도</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">최근 민원 현황</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">위치</th>
                <th className="p-2 text-left">내용</th>
                <th className="p-2 text-left">접수일</th>
                <th className="p-2 text-left">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">수정구 태평동</td>
                <td className="p-2">빗물받이 악취</td>
                <td className="p-2">2025-04-28</td>
                <td className="p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">처리중</span></td>
              </tr>
              <tr className="border-b">
                <td className="p-2">중원구 금광동</td>
                <td className="p-2">맨홀 악취</td>
                <td className="p-2">2025-04-26</td>
                <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">완료</span></td>
              </tr>
              <tr>
                <td className="p-2">수정구 신촌동</td>
                <td className="p-2">하수관 악취</td>
                <td className="p-2">2025-04-25</td>
                <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">완료</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">악취저감시설 현황</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">시설유형</th>
                <th className="p-2 text-left">설치 수량</th>
                <th className="p-2 text-left">정상 가동률</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">정화조 악취저감시설</td>
                <td className="p-2">215</td>
                <td className="p-2">92%</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">맨홀 악취차단장치</td>
                <td className="p-2">430</td>
                <td className="p-2">95%</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">빗물받이 악취차단장치</td>
                <td className="p-2">620</td>
                <td className="p-2">88%</td>
              </tr>
              <tr>
                <td className="p-2">맨홀 단차부 낙차완화시설</td>
                <td className="p-2">85</td>
                <td className="p-2">98%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;