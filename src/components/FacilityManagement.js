import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { FiFilter, FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa';

const FACILITY_TYPES = [
  { key: '지점형', label: '측정(지점)', type: '지점형' },
  { key: '구역형', label: '측정(구역)', type: '구역형' },
  { key: '저감시설', label: '저감', type: '저감' },
  { key: '통신장비', label: '통신', type: '통신' },
];

// 악취지도 샘플 마커 데이터 기반 측정지점
const markerSample = [
  { label: '봉선동', markerLabel: 'P2', location: '광수비어 봉선점 앞 공영주차장' },
  { label: '방림동', markerLabel: 'P0', location: '방림동 주민센터 옆 공원' },
  { label: '주월동', markerLabel: 'A', location: '광수비어 주월점 앞 공영주차장' },
  { label: '진월동', markerLabel: 'P2', location: '진월동 주민센터 앞 공원' },
  { label: '송암동', markerLabel: 'P0', location: '송암동 주민센터 옆 공원' },
  { label: '월산동', markerLabel: 'P2', location: '월산동 주민센터 앞 공원' },
  { label: '봉선동', markerLabel: 'P1', location: '봉선동 주민센터 앞 공원' },
  { label: '방림동', markerLabel: 'P2', location: '방림동 공영주차장' },
  { label: '주월동', markerLabel: 'P0', location: '주월동 주민센터 옆 공원' },
  { label: '진월동', markerLabel: 'P1', location: '진월동 공영주차장' },
  { label: '송암동', markerLabel: 'P2', location: '송암동 공영주차장' },
  { label: '월산동', markerLabel: 'P0', location: '월산동 공영주차장' },
  { label: '봉선동', markerLabel: 'P2', location: '봉선동 공영주차장' },
  { label: '방림동', markerLabel: 'P1', location: '방림동 주민센터 앞 공원' },
  { label: '주월동', markerLabel: 'P2', location: '주월동 공영주차장' }
];

// 샘플 시설 데이터 생성
const sampleFacilities = [];
let id = 1;
markerSample.forEach(marker => {
  // 측정시설(지점형 또는 구역형 중 하나)
  const isPointType = Math.random() > 0.5;
  sampleFacilities.push({
    id: id++,
    name: marker.location,
    type: isPointType ? '지점형' : '구역형',
    location: `광주 남구 ${marker.label}`,
    status: '정상',
    currentGrade: '보통',
    currentValue: 0.08,
    lastMaintenance: '2024-04-15 10:00',
    lastInspectionType: '현장점검',
    nextMaintenance: '2024-07-15',
    sensorData: {
      doorStatus: '닫힘',
      leakageStatus: '정상',
      powerStatus: '정상'
    }
  });
  // 통신장비
  sampleFacilities.push({
    id: id++,
    name: marker.location,
    type: '통신장비',
    location: `광주 남구 ${marker.label}`,
    status: '정상',
    lastMaintenance: '2024-04-10 13:10',
    lastInspectionType: '원격점검',
    nextMaintenance: '2024-07-10'
  });
  // 저감시설
  sampleFacilities.push({
    id: id++,
    name: marker.location,
    type: '저감시설',
    location: `광주 남구 ${marker.label}`,
    status: '가동중',
    operationCount: 12,
    operationHours: 156,
    lastMaintenance: '2024-04-15 09:00',
    lastInspectionType: '현장점검',
    nextMaintenance: '2024-07-15'
  });
});

const FacilityManagement = () => {
  // 시설 유형 선택 상태
  const [selectedFacilityType, setSelectedFacilityType] = useState('all');
  // 선택된 시설 상태
  const [selectedFacility, setSelectedFacility] = useState(null);
  // 필터 상태
  const [filters, setFilters] = useState({
    district: 'all',
    grade: 'all',
    date: new Date().toISOString().split('T')[0]
  });
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 필터링된 시설 목록
  const filteredFacilities = useMemo(() => {
    return sampleFacilities.filter(facility => {
      if (selectedFacilityType !== 'all' && facility.type !== selectedFacilityType) return false;
      if (filters.district !== 'all' && !facility.location.includes(filters.district)) return false;
      if (filters.grade !== 'all' && facility.currentGrade !== filters.grade) return false;
      return true;
    });
  }, [selectedFacilityType, filters]);

  // 페이징된 시설 목록
  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  const pagedFacilities = filteredFacilities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 시설 상세 정보 표시
  const renderFacilityDetail = () => {
    if (!selectedFacility) return null;
    // 1) 악취농도: 첫번째(3~10시) 천천히 1.8까지 상승 후 천천히 하강, 두번째(15~18시) 급하게 2.0까지 상승 후 빠르게 하강
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const odorData = [];
    // 3~10시: 0.08~1.8까지 천천히 상승
    for (let i = 0; i < 24; i++) {
      if (i >= 3 && i <= 10) {
        // 3~10시: 0.08 → 1.8 (선형 증가 + 약간의 랜덤)
        const base = 0.08 + ((i - 3) / 7) * (1.8 - 0.08);
        odorData.push((base + (Math.random() - 0.5) * 0.08).toFixed(3));
      }
      // 11~14시: 1.8 → 0.08 (천천히 하강)
      else if (i >= 11 && i <= 14) {
        const base = 1.8 - ((i - 11) / 3) * (1.8 - 0.08);
        odorData.push((base + (Math.random() - 0.5) * 0.08).toFixed(3));
      }
      // 15~16시: 0.08 → 2.0 (급격히 상승)
      else if (i === 15) {
        odorData.push((0.08 + Math.random() * 0.05).toFixed(3));
      } else if (i === 16) {
        odorData.push((1.0 + Math.random() * 0.3).toFixed(3));
      } else if (i === 17) {
        odorData.push((1.7 + Math.random() * 0.2).toFixed(3));
      } else if (i === 18) {
        odorData.push((2.0 + Math.random() * 0.1).toFixed(3));
      }
      // 19~21시: 2.0 → 0.08 (빠르게 하강)
      else if (i >= 19 && i <= 21) {
        const base = 2.0 - ((i - 19) / 2) * (2.0 - 0.08);
        odorData.push((base + (Math.random() - 0.5) * 0.08).toFixed(3));
      }
      // 나머지 시간: 0.05~0.08
      else {
        odorData.push((0.05 + Math.random() * 0.03).toFixed(3));
      }
    }
    // 2) 가동률: 악취농도가 1.5 이상이면 100%, 아니면 0%
    const rateData = odorData.map(v => parseFloat(v) >= 1.5 ? 100 : 0);
    const chartData = {
      labels: hours,
      datasets: [
        {
          label: '악취농도(ppm)',
          data: odorData,
          borderColor: '#FFC107',
          backgroundColor: 'rgba(255,193,7,0.2)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y-odor',
        },
        {
          label: '가동률(%)',
          data: rateData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76,175,80,0.2)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y-rate',
        }
      ]
    };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        'y-odor': {
          type: 'linear',
          position: 'left',
          title: { display: true, text: '악취농도(ppm)' },
          beginAtZero: true,
          grid: { color: 'rgba(229,231,235,0.2)' },
          ticks: { color: '#333' },
        },
        'y-rate': {
          type: 'linear',
          position: 'right',
          title: { display: true, text: '가동률(%)' },
          beginAtZero: true,
          min: 0,
          max: 100,
          grid: { drawOnChartArea: false },
          ticks: { color: '#388E3C' },
        }
      }
    };
    return (
      <div className="flex flex-row gap-6 w-full min-h-[320px] max-h-[60vh]">
        {/* 왼쪽 상세 텍스트 (34%) */}
        <div className="w-1/3 flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-4">{selectedFacility.name}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">유형:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                selectedFacility.type === '지점형' || selectedFacility.type === '구역형' ? 'bg-blue-100 text-blue-800' :
                selectedFacility.type === '저감시설' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {FACILITY_TYPES.find(t => t.key === selectedFacility.type)?.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">위치:</span>
              <span>{selectedFacility.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">상태:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                selectedFacility.status === '정상' ? 'bg-green-100 text-green-800' :
                selectedFacility.status === '가동중' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedFacility.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">최근 점검:</span>
              <span>{selectedFacility.lastMaintenance}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">점검유형:</span>
              <span className={`font-semibold ${
                selectedFacility.lastInspectionType === '현장점검' ? 'text-blue-600' : 'text-purple-600'
              }`}>
                {selectedFacility.lastInspectionType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">다음 점검:</span>
              <span>{selectedFacility.nextMaintenance}</span>
            </div>
            {selectedFacility.type === '저감시설' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">가동 횟수:</span>
                  <span>{selectedFacility.operationCount}회</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">가동 시간:</span>
                  <span>{selectedFacility.operationHours}시간</span>
                </div>
              </>
            )}
            {(selectedFacility.type === '지점형' || selectedFacility.type === '구역형') && selectedFacility.sensorData && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">문 상태:</span>
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${
                      selectedFacility.sensorData.doorStatus === '열림' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {selectedFacility.sensorData.doorStatus}
                    </span>
                    {selectedFacility.sensorData.doorStatus === '열림' ? (
                      <FaDoorOpen className="text-red-600" />
                    ) : (
                      <FaDoorClosed className="text-green-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">누전 상태:</span>
                  <span>{selectedFacility.sensorData.leakageStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">전원 상태:</span>
                  <span>{selectedFacility.sensorData.powerStatus}</span>
                </div>
              </>
            )}
          </div>
        </div>
        {/* 오른쪽 차트 (66%) */}
        <div className="w-2/3 flex items-center">
          <div className="w-full h-80 max-h-[40vh]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-0 pt-0">
      <h2 className="text-xl font-bold mb-4">시설 관리</h2>
      {/* 상단 시설구분 버튼 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FACILITY_TYPES.map(type => (
          <button
            key={type.key}
            className={`px-4 py-2 rounded font-semibold border transition-colors duration-150 ${selectedFacilityType === type.key ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
            onClick={() => { setSelectedFacilityType(type.key); setCurrentPage(1); }}
          >
            {type.label}
          </button>
        ))}
            <button 
          className={`px-4 py-2 rounded font-semibold border transition-colors duration-150 ${selectedFacilityType === 'all' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
          onClick={() => { setSelectedFacilityType('all'); setCurrentPage(1); }}
            >
              전체
            </button>
        <div className="flex gap-2 ml-auto">
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filters.district}
            onChange={(e) => { setFilters(prev => ({ ...prev, district: e.target.value })); setCurrentPage(1); }}
            >
            <option value="all">전체 행정동</option>
            <option value="봉선동">봉선동</option>
            <option value="방림동">방림동</option>
            <option value="주월동">주월동</option>
            <option value="진월동">진월동</option>
            <option value="송암동">송암동</option>
            <option value="월산동">월산동</option>
          </select>
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filters.grade}
            onChange={(e) => { setFilters(prev => ({ ...prev, grade: e.target.value })); setCurrentPage(1); }}
            >
            <option value="all">전체 등급</option>
            <option value="매우좋음">매우 좋음</option>
            <option value="좋음">좋음</option>
            <option value="보통">보통</option>
            <option value="나쁨">나쁨</option>
            <option value="매우나쁨">매우 나쁨</option>
          </select>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2"
            value={filters.date}
            onChange={(e) => { setFilters(prev => ({ ...prev, date: e.target.value })); setCurrentPage(1); }}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 ml-2">
          <FiPlus /> 시설 등록
          </button>
      </div>
      
      {/* 시설 목록 테이블 (상단) */}
      <div className="bg-white rounded shadow overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">유형</th>
              <th className="p-3 text-left">방식</th>
              <th className="p-3 text-left">시설명</th>
              <th className="p-3 text-left">위치</th>
              <th className="p-3 text-left">상태</th>
              <th className="p-3 text-left">등급</th>
              <th className="p-3 text-left">최근 점검일시</th>
              <th className="p-3 text-left">점검유형</th>
            </tr>
          </thead>
          <tbody>
            {pagedFacilities.map(facility => (
              <tr
                key={facility.id}
                className={`border-b hover:bg-gray-50 cursor-pointer ${selectedFacility?.id === facility.id ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedFacility(facility)}
              >
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    facility.type === '지점형' || facility.type === '구역형' ? 'bg-blue-100 text-blue-800' :
                    facility.type === '저감시설' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {FACILITY_TYPES.find(t => t.key === facility.type)?.label}
                  </span>
                </td>
                <td className="p-3">
                  {(facility.type === '지점형' || facility.type === '구역형') && (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                  {facility.type}
                    </span>
                  )}
              </td>
                <td className="p-3 font-semibold">{facility.name}</td>
                <td className="p-3">{facility.location}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    facility.status === '정상' ? 'bg-green-100 text-green-800' :
                    facility.status === '가동중' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {facility.status}
                  </span>
              </td>
                <td className="p-3">
                  {facility.currentGrade && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      facility.currentGrade === '매우좋음' ? 'bg-blue-100 text-blue-800' :
                      facility.currentGrade === '좋음' ? 'bg-green-100 text-green-800' :
                      facility.currentGrade === '보통' ? 'bg-yellow-100 text-yellow-800' :
                      facility.currentGrade === '나쁨' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {facility.currentGrade}
                    </span>
                  )}
              </td>
                <td className="p-3">{facility.lastMaintenance}</td>
                <td className="p-3">{facility.lastInspectionType}</td>
            </tr>
            ))}
          </tbody>
        </table>
      {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-2 py-4 bg-gray-50">
        <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-blue-100 font-semibold"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >이전</button>
          {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
              className={`w-8 h-8 rounded-full font-semibold text-sm focus:outline-none transition-colors duration-200 ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-blue-100 font-semibold"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >다음</button>
      </div>
      </div>

      {/* 상세정보 영역 */}
      {selectedFacility && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex-1 min-h-[320px] max-h-[60vh] overflow-auto">{renderFacilityDetail()}</div>
      )}
    </div>
  );
};

export default FacilityManagement;