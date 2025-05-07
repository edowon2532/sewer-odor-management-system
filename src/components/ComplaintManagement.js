import React, { useState } from 'react';

const ComplaintManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const complaints = [
    {
      id: 1,
      location: '광주 남구 봉선동',
      type: '빗물받이 악취',
      date: '2025-04-28',
      status: '처리중',
      description: '빗물받이에서 심한 악취가 발생하고 있습니다.',
      contact: '010-1234-5678'
    },
    {
      id: 2,
      location: '광주 남구 주월동',
      type: '맨홀 악취',
      date: '2025-04-26',
      status: '완료',
      description: '맨홀에서 악취가 발생하여 불편을 겪고 있습니다.',
      contact: '010-2345-6789'
    },
    {
      id: 3,
      location: '광주 남구 방림동',
      type: '하수관 악취',
      date: '2025-04-25',
      status: '완료',
      description: '하수관에서 악취가 발생하고 있습니다.',
      contact: '010-3456-7890'
    },
    {
      id: 4,
      location: '광주 남구 양림동',
      type: '정화조 악취',
      date: '2025-04-24',
      status: '처리중',
      description: '정화조에서 악취가 발생하여 주민들이 불편을 겪고 있습니다.',
      contact: '010-4567-8901'
    },
    {
      id: 5,
      location: '광주 남구 구동',
      type: '빗물받이 악취',
      date: '2025-04-23',
      status: '완료',
      description: '빗물받이에서 악취가 발생하고 있습니다.',
      contact: '010-5678-9012'
    }
  ];

  const filteredComplaints = selectedStatus === 'all' 
    ? complaints 
    : complaints.filter(complaint => complaint.status === selectedStatus);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">민원 관리</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded ${selectedStatus === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedStatus('all')}
            >
              전체
            </button>
            <button 
              className={`px-4 py-2 rounded ${selectedStatus === '처리중' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedStatus('처리중')}
            >
              처리중
            </button>
            <button 
              className={`px-4 py-2 rounded ${selectedStatus === '완료' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedStatus('완료')}
            >
              완료
            </button>
        </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded">
            민원 등록
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">위치</th>
              <th className="p-3 text-left">유형</th>
              <th className="p-3 text-left">접수일</th>
              <th className="p-3 text-left">상태</th>
              <th className="p-3 text-left">내용</th>
              <th className="p-3 text-left">연락처</th>
              <th className="p-3 text-left">조치</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map(complaint => (
              <tr key={complaint.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{complaint.location}</td>
                <td className="p-3">{complaint.type}</td>
                <td className="p-3">{complaint.date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    complaint.status === '완료' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complaint.status}
                  </span>
              </td>
                <td className="p-3">{complaint.description}</td>
                <td className="p-3">{complaint.contact}</td>
                <td className="p-3">
                  <button className="text-teal-600 hover:text-teal-800 mr-2">상세</button>
                  <button className="text-red-600 hover:text-red-800">삭제</button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintManagement;