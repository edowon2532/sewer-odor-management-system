import React, { useState, useEffect } from 'react';
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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  // 랜덤 데이터 생성 함수 (기본 패턴 + 소폭 변동)
  const addRandomNoise = (arr, noise = 0.02) => {
    return arr.map(v => (parseFloat(v) + (Math.random() * 2 - 1) * noise).toFixed(2));
  };

  // 지역별 기본 패턴
  const basePatterns = {
    '봉선동': [0.12, 0.15, 0.13, 0.18, 0.21, 0.19, 0.16, 0.14],
    '주월동': [0.09, 0.11, 0.10, 0.13, 0.15, 0.14, 0.12, 0.10],
    '방림동': [0.22, 0.20, 0.18, 0.15, 0.12, 0.14, 0.16, 0.18],
    '양림동': [0.10, 0.12, 0.11, 0.14, 0.17, 0.15, 0.13, 0.12],
    '백운동': [0.13, 0.14, 0.13, 0.17, 0.20, 0.18, 0.15, 0.13]
  };

  // 실시간 모니터링 데이터
  const monitoringData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [
      {
        label: '봉선동',
        data: addRandomNoise(basePatterns['봉선동']),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: '주월동',
        data: addRandomNoise(basePatterns['주월동']),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: '방림동',
        data: addRandomNoise(basePatterns['방림동']),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: '양림동',
        data: addRandomNoise(basePatterns['양림동']),
        borderColor: 'rgb(255, 205, 86)',
        tension: 0.1
      },
      {
        label: '백운동',
        data: addRandomNoise(basePatterns['백운동']),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  // 악취저감시설 실시간 가동제어 상태
  const [odorFacilities, setOdorFacilities] = useState([
    { id: 1, type: '지점형', markerLabel: 'P0', name: '봉선동 저감시설-001', status: '정지', startTime: '', stopTime: '', reason: '' },
    { id: 2, type: '지점형', markerLabel: 'P2', name: '방림동 저감시설-002', status: '가동중', startTime: '2024-06-10 09:00', stopTime: '', reason: '수동' },
    { id: 3, type: '구역형', markerLabel: 'A', name: '주월동 저감시설-003', status: '정지', startTime: '', stopTime: '', reason: '' },
    { id: 4, type: '지점형', markerLabel: 'P0', name: '양림동 저감시설-004', status: '가동중', startTime: '2024-06-10 08:30', stopTime: '', reason: '자동(수치상승)' },
    { id: 5, type: '지점형', markerLabel: 'P2', name: '백운동 저감시설-005', status: '정지', startTime: '', stopTime: '', reason: '' }
  ]);

  // 상태가 '정지'인 시설의 stopTime을 어제 날짜의 랜덤 시각으로 할당
  useEffect(() => {
    setOdorFacilities(facs => facs.map(fac => {
      if (fac.status === '정지' && !fac.stopTime) {
        const now = new Date();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const randHour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        const randMin = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const stopTime = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')} ${randHour}:${randMin}`;
        return { ...fac, stopTime };
      }
      // 상태가 '가동중'인 시설의 startTime을 오늘 날짜의 랜덤 시각으로 할당
      if (fac.status === '가동중' && !fac.startTime) {
        const now = new Date();
        const randHour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        const randMin = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const startTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${randHour}:${randMin}`;
        return { ...fac, startTime };
      }
      return fac;
    }));
  }, []);

  // 악취저감시설 실시간 가동제어 페이징 처리
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(odorFacilities.length / itemsPerPage);
  const pagedFacilities = odorFacilities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 모니터링 지역 현황 데이터 (광주 남구 읍면동 전체)
  const monitoringRegions = [
    { name: '봉선동', value: 0.12, temp: 23.5, humidity: 62.0, status: '매우 좋음' },
    { name: '방림1동', value: 0.18, temp: 24.1, humidity: 58.2, status: '좋음' },
    { name: '방림2동', value: 0.21, temp: 23.8, humidity: 60.5, status: '보통' },
    { name: '사직동', value: 0.25, temp: 25.1, humidity: 57.0, status: '나쁨' },
    { name: '양림동', value: 0.28, temp: 23.2, humidity: 61.0, status: '매우 나쁨' },
    { name: '주월1동', value: 0.19, temp: 24.0, humidity: 59.8, status: '좋음' },
    { name: '주월2동', value: 0.20, temp: 23.7, humidity: 60.2, status: '보통' },
    { name: '진월동', value: 0.23, temp: 22.8, humidity: 65.0, status: '나쁨' },
    { name: '백운1동', value: 0.24, temp: 23.6, humidity: 59.1, status: '좋음' },
    { name: '백운2동', value: 0.26, temp: 24.3, humidity: 58.7, status: '보통' },
    { name: '송암동', value: 0.21, temp: 23.0, humidity: 60.0, status: '좋음' },
    { name: '월산동', value: 0.20, temp: 24.5, humidity: 55.0, status: '매우 좋음' },
    { name: '월산4동', value: 0.27, temp: 23.9, humidity: 61.5, status: '나쁨' },
    { name: '대촌동', value: 0.17, temp: 24.0, humidity: 57.0, status: '좋음' },
    { name: '임암동', value: 0.22, temp: 23.3, humidity: 60.8, status: '보통' },
    { name: '칠석동', value: 0.23, temp: 23.7, humidity: 59.9, status: '좋음' },
    { name: '덕남동', value: 0.25, temp: 24.2, humidity: 58.3, status: '나쁨' }
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

  // 엑셀 다운로드 함수
  const handleExcelDownload = () => {
    // 데이터 변환
    const data = odorFacilities.map(fac => ({
      '시설유형': fac.type,
      '마커라벨': fac.markerLabel,
      '시설명': fac.name,
      '상태': fac.status,
      '운전 시작 시각': fac.startTime,
      '정지 시각': fac.stopTime,
      '운전 원인': fac.reason
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '악취저감시설');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '악취저감시설_실시간가동제어.xlsx');
  };

  // 모바일 환경 감지
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
                  title: {
                    display: true,
                    text: '황화수소 농도(ppm)'
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
                <th className="p-2 text-left">평균 황화수소 농도(ppm)</th>
                {!isMobile && <th className="p-2 text-left">평균 온도(℃)</th>}
                {!isMobile && <th className="p-2 text-left">평균 습도(%)</th>}
                <th className="p-2 text-left">상태</th>
              </tr>
            </thead>
            <tbody>
              {pagedRegions.map((region, idx) => (
                <tr key={region.name} className={idx !== pagedRegions.length - 1 ? 'border-b' : ''}>
                  <td className="p-2">{region.name}</td>
                  <td className="p-2">{region.value} ppm</td>
                  {!isMobile && <td className="p-2">{region.temp} ℃</td>}
                  {!isMobile && <td className="p-2">{region.humidity} %</td>}
                  <td className="p-2">
                    {region.status === '매우 좋음' && <span className="bg-[#2563eb] text-white px-2 py-1 rounded text-sm">매우 좋음</span>}
                    {region.status === '좋음' && <span className="bg-[#8BC34A] text-white px-2 py-1 rounded text-sm">좋음</span>}
                    {region.status === '보통' && <span className="bg-[#FFC107] text-black px-2 py-1 rounded text-sm">보통</span>}
                    {region.status === '나쁨' && <span className="bg-[#FF9800] text-white px-2 py-1 rounded text-sm">나쁨</span>}
                    {region.status === '매우 나쁨' && <span className="bg-[#F44336] text-white px-2 py-1 rounded text-sm">매우 나쁨</span>}
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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">악취저감시설 실시간 가동제어</h3>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded shadow text-sm font-semibold"
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </button>
        </div>
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
                  <span className={`inline-block min-w-[48px] text-center rounded px-2 py-0.5 text-xs font-bold mr-2
                    ${fac.type === '지점형' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
                <td className="p-2"><span className="text-gray-400">{fac.stopTime}</span></td>
                <td className="p-2">{fac.reason}</td>
                <td className="p-2">
                  <button
                    className={`w-28 h-9 flex items-center justify-center rounded font-semibold shadow text-base transition-colors duration-200
                      ${fac.status === '가동중' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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