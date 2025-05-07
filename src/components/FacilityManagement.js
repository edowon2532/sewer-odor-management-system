import React, { useState } from 'react';

const FacilityManagement = () => {
  const [selectedType, setSelectedType] = useState('all');

  const facilities = [
    {
      id: 1,
      name: '구동 구역형 악취저감시설',
      type: '구역형 악취저감시설',
      location: '광주 남구 구동',
      status: '정상',
      lastMaintenance: '2025-04-15',
      nextMaintenance: '2025-07-15'
    },
    {
      id: 2,
      name: '방림동 빗물받이 악취차단장치',
      type: '빗물받이 악취차단장치',
      location: '광주 남구 방림동',
      status: '고장',
      lastMaintenance: '2025-03-20',
      nextMaintenance: '2025-06-20'
    },
    {
      id: 3,
      name: '봉선동 정화조 악취저감시설',
      type: '정화조 악취저감시설',
      location: '광주 남구 봉선동',
      status: '정상',
      lastMaintenance: '2025-04-15',
      nextMaintenance: '2025-07-15'
    },
    {
      id: 4,
      name: '주월동 맨홀 악취차단장치',
      type: '맨홀 악취차단장치',
      location: '광주 남구 주월동',
      status: '정상',
      lastMaintenance: '2025-04-10',
      nextMaintenance: '2025-07-10'
    },
    {
      id: 5,
      name: '양림동 맨홀 단차부 낙차완화시설',
      type: '맨홀 단차부 낙차완화시설',
      location: '광주 남구 양림동',
      status: '정상',
      lastMaintenance: '2025-04-05',
      nextMaintenance: '2025-07-05'
    },
    { id: 6, name: '진월동 정화조 악취저감시설', type: '정화조 악취저감시설', location: '광주 남구 진월동', status: '정상', lastMaintenance: '2025-04-01', nextMaintenance: '2025-07-01' },
    { id: 7, name: '백운동 맨홀 악취차단장치', type: '맨홀 악취차단장치', location: '광주 남구 백운동', status: '정상', lastMaintenance: '2025-03-28', nextMaintenance: '2025-06-28' },
    { id: 8, name: '월산동 빗물받이 악취차단장치', type: '빗물받이 악취차단장치', location: '광주 남구 월산동', status: '점검필요', lastMaintenance: '2025-03-25', nextMaintenance: '2025-06-25' },
    { id: 9, name: '대촌동 맨홀 단차부 낙차완화시설', type: '맨홀 단차부 낙차완화시설', location: '광주 남구 대촌동', status: '정상', lastMaintenance: '2025-03-22', nextMaintenance: '2025-06-22' },
    { id: 10, name: '임암동 정화조 악취저감시설', type: '정화조 악취저감시설', location: '광주 남구 임암동', status: '고장', lastMaintenance: '2025-03-19', nextMaintenance: '2025-06-19' },
    { id: 11, name: '칠석동 맨홀 악취차단장치', type: '맨홀 악취차단장치', location: '광주 남구 칠석동', status: '정상', lastMaintenance: '2025-03-16', nextMaintenance: '2025-06-16' },
    { id: 12, name: '덕남동 빗물받이 악취차단장치', type: '빗물받이 악취차단장치', location: '광주 남구 덕남동', status: '정상', lastMaintenance: '2025-03-13', nextMaintenance: '2025-06-13' },
    { id: 13, name: '송암동 정화조 악취저감시설', type: '정화조 악취저감시설', location: '광주 남구 송암동', status: '정상', lastMaintenance: '2025-03-10', nextMaintenance: '2025-06-10' },
    { id: 14, name: '월산4동 맨홀 단차부 낙차완화시설', type: '맨홀 단차부 낙차완화시설', location: '광주 남구 월산4동', status: '정상', lastMaintenance: '2025-03-07', nextMaintenance: '2025-06-07' },
    { id: 15, name: '사직동 정화조 악취저감시설', type: '정화조 악취저감시설', location: '광주 남구 사직동', status: '정상', lastMaintenance: '2025-03-04', nextMaintenance: '2025-06-04' }
  ];

  const filteredFacilities = selectedType === 'all' 
    ? facilities 
    : facilities.filter(facility => facility.type === selectedType);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  const pagedFacilities = filteredFacilities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">시설 관리</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded ${selectedType === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedType('all')}
            >
              전체
            </button>
            <button 
              className={`px-4 py-2 rounded ${selectedType === '정화조 악취저감시설' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedType('정화조 악취저감시설')}
            >
              정화조 악취저감시설
            </button>
            <button 
              className={`px-4 py-2 rounded ${selectedType === '맨홀 악취차단장치' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedType('맨홀 악취차단장치')}
            >
              맨홀 악취차단장치
            </button>
            <button 
              className={`px-4 py-2 rounded ${selectedType === '빗물받이 악취차단장치' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedType('빗물받이 악취차단장치')}
            >
              빗물받이 악취차단장치
            </button>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded">
            시설 등록
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">시설명</th>
              <th className="p-3 text-left">유형</th>
              <th className="p-3 text-left">위치</th>
              <th className="p-3 text-left">상태</th>
              <th className="p-3 text-left">최근 점검일</th>
              <th className="p-3 text-left">다음 점검일</th>
              <th className="p-3 text-left">조치</th>
            </tr>
          </thead>
          <tbody>
            {pagedFacilities.map(facility => (
              <tr key={facility.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{facility.name}</td>
                <td className="p-3">
                  {['정화조 악취저감시설','맨홀 악취차단장치','맨홀 단차부 낙차완화시설'].includes(facility.type) ? (
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-bold mr-2 bg-blue-100 text-blue-700">지점형</span>
                  ) : (
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-bold mr-2 bg-yellow-100 text-yellow-700">구역형</span>
                  )}
                  {facility.type}
                </td>
                <td className="p-3">{facility.location}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    facility.status === '정상' 
                      ? 'bg-green-100 text-green-800'
                      : facility.status === '점검필요'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {facility.status}
                  </span>
                </td>
                <td className="p-3">{facility.lastMaintenance}</td>
                <td className="p-3">{facility.nextMaintenance}</td>
                <td className="p-3">
                  <button className="text-teal-600 hover:text-teal-800 mr-2">상세</button>
                  <button className="text-red-600 hover:text-red-800">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
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
  );
};

export default FacilityManagement;