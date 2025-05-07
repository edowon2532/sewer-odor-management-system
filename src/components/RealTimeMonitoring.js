import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RealTimeMonitoring = () => {
  // 실시간 모니터링 데이터
  const monitoringData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [
      {
        label: '봉선동',
        data: [2.1, 2.3, 2.0, 2.4, 2.6, 2.5, 2.3, 2.2],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: '주월동',
        data: [1.8, 1.9, 2.1, 2.3, 2.4, 2.2, 2.0, 1.9],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: '방림동',
        data: [2.3, 2.4, 2.2, 2.5, 2.7, 2.6, 2.4, 2.3],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  };

  // 악취저감시설 실시간 가동제어 상태
  const [odorFacilities, setOdorFacilities] = useState([
    { id: 1, type: '거점형', markerLabel: 'P0', name: '봉선동 저감시설-001', status: '정지', startTime: '', stopTime: '', reason: '' },
    { id: 2, type: '거점형', markerLabel: 'P2', name: '방림동 저감시설-002', status: '가동중', startTime: '2024-06-10 09:00', stopTime: '', reason: '수동' },
    { id: 3, type: '구역형', markerLabel: 'A', name: '주월동 저감시설-003', status: '정지', startTime: '', stopTime: '', reason: '' },
    { id: 4, type: '거점형', markerLabel: 'P0', name: '양림동 저감시설-004', status: '가동중', startTime: '2024-06-10 08:30', stopTime: '', reason: '자동(수치상승)' },
    { id: 5, type: '거점형', markerLabel: 'P2', name: '백운동 저감시설-005', status: '정지', startTime: '', stopTime: '', reason: '' }
  ]);

  // 악취저감시설 실시간 가동제어 페이징 처리
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(odorFacilities.length / itemsPerPage);
  const pagedFacilities = odorFacilities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 모니터링 지역 현황 데이터 (광주 남구 읍면동 전체)
  const monitoringRegions = [
    { name: '봉선동', value: 2.2, nh3: 0.51, status: '정상' },
    { name: '방림1동', value: 1.8, nh3: 0.32, status: '정상' },
    { name: '방림2동', value: 2.1, nh3: 0.41, status: '정상' },
    { name: '사직동', value: 2.5, nh3: 0.60, status: '주의' },
    { name: '양림동', value: 2.8, nh3: 0.72, status: '경계' },
    { name: '주월1동', value: 1.9, nh3: 0.28, status: '정상' },
    { name: '주월2동', value: 2.0, nh3: 0.33, status: '정상' },
    { name: '진월동', value: 2.3, nh3: 0.44, status: '정상' },
    { name: '백운1동', value: 2.4, nh3: 0.48, status: '정상' },
    { name: '백운2동', value: 2.6, nh3: 0.55, status: '주의' },
    { name: '송암동', value: 2.1, nh3: 0.36, status: '정상' },
    { name: '월산동', value: 2.0, nh3: 0.31, status: '정상' },
    { name: '월산4동', value: 2.7, nh3: 0.68, status: '경계' },
    { name: '대촌동', value: 1.7, nh3: 0.22, status: '정상' },
    { name: '임암동', value: 2.2, nh3: 0.39, status: '정상' },
    { name: '칠석동', value: 2.3, nh3: 0.42, status: '정상' },
    { name: '덕남동', value: 2.5, nh3: 0.57, status: '주의' }
  ];
  // 페이징 상태(모니터링 지역 현황)
  const [regionPage, setRegionPage] = useState(1);
  const regionsPerPage = 6;
  const regionTotalPages = Math.ceil(monitoringRegions.length / regionsPerPage);
  const pagedRegions = monitoringRegions.slice((regionPage - 1) * regionsPerPage, regionPage * regionsPerPage);

  // 시각 포맷 함수
  const getNowString = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  const handleToggleStatus = (id) => {
    setOdorFacilities(facs =>
      facs.map(fac => {
        if (fac.id === id) {
          if (fac.status === '가동중') {
            // 정지로 변경
            return {
              ...fac,
              status: '정지',
              stopTime: getNowString(),
              reason: '수동'
            };
          } else {
            // 가동중으로 변경
            return {
              ...fac,
              status: '가동중',
              startTime: getNowString(),
              reason: '수동'
            };
          }
        }
        return fac;
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="text-xl font-bold mb-4">실시간 악취 모니터링</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">지역별 실시간 악취 수준</h3>
          <div className="h-96">
            <Line data={monitoringData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  title: {
                    display: true,
                    text: '악취 등급'
                  }
                }
              }
            }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">모니터링 지역 현황</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">지역</th>
                <th className="p-2 text-left">평균 황화수소 농도</th>
                <th className="p-2 text-left">평균 암모니아 농도</th>
                <th className="p-2 text-left">상태</th>
              </tr>
            </thead>
            <tbody>
              {pagedRegions.map((region, idx) => (
                <tr key={region.name} className={idx !== pagedRegions.length - 1 ? 'border-b' : ''}>
                  <td className="p-2">{region.name}</td>
                  <td className="p-2">{region.value}</td>
                  <td className="p-2">{region.nh3}</td>
                  <td className="p-2">
                    {region.status === '정상' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">정상</span>}
                    {region.status === '주의' && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">주의</span>}
                    {region.status === '경계' && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">경계</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 페이지네이션 */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-teal-100 font-semibold"
              onClick={() => setRegionPage(p => Math.max(1, p - 1))}
              disabled={regionPage === 1}
            >이전</button>
            {[...Array(regionTotalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                className={`w-8 h-8 rounded-full font-semibold text-sm focus:outline-none transition-colors duration-200 ${regionPage === idx + 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-teal-100'}`}
                onClick={() => setRegionPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-teal-100 font-semibold"
              onClick={() => setRegionPage(p => Math.min(regionTotalPages, p + 1))}
              disabled={regionPage === regionTotalPages}
            >다음</button>
          </div>
        </div>
      </div>

      {/* 악취저감시설 실시간 가동제어 섹션 */}
      <div className="bg-white rounded shadow p-4 mt-8 overflow-x-auto max-h-[calc(100vh-24rem)]">
        <h3 className="text-lg font-bold mb-2">악취저감시설 실시간 가동제어</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">시설유형</th>
              <th className="p-2 text-left">시설명</th>
              <th className="p-2 text-left">상태</th>
              <th className="p-2 text-left">운전 시작 시각</th>
              <th className="p-2 text-left">정지 시각</th>
              <th className="p-2 text-left">운전 원인</th>
              <th className="p-2 text-left">제어</th>
              <th className="p-2 text-left">설정</th>
            </tr>
          </thead>
          <tbody>
            {pagedFacilities.map(fac => (
              <tr key={fac.id} className="border-b">
                <td className="p-2">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold mr-2 ${fac.type === '거점형' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {fac.markerLabel}
                  </span>
                  {fac.type}
                </td>
                <td className="p-2">{fac.name}</td>
                <td className="p-2">
                  <span className={fac.status === '가동중' ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                    {fac.status}
                  </span>
                </td>
                <td className="p-2">{fac.startTime}</td>
                <td className="p-2">{fac.stopTime}</td>
                <td className="p-2">{fac.reason}</td>
                <td className="p-2">
                  <button
                    className={`px-3 py-1 rounded font-semibold shadow ${fac.status === '가동중' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={() => handleToggleStatus(fac.id)}
                  >
                    {fac.status === '가동중' ? '정지' : '가동 시작'}
                  </button>
                </td>
                <td className="p-2">
                  <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold">설정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 페이지네이션 (4페이지로 고정) */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-teal-100 font-semibold"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >이전</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`w-8 h-8 rounded-full font-semibold text-sm focus:outline-none transition-colors duration-200 ${currentPage === idx + 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-teal-100'}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-teal-100 font-semibold"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >다음</button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;