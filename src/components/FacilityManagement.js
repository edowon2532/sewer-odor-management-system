import React from 'react';

const FacilityManagement = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">악취저감시설 관리</h2>
      
      <div className="mb-4 flex justify-between">
        <div>
          <button className="bg-teal-600 text-white px-3 py-1 rounded mr-2">새 시설 등록</button>
          <button className="bg-gray-200 px-3 py-1 rounded mr-2">보고서 출력</button>
        </div>
        <div className="flex">
          <input type="text" placeholder="시설 검색" className="border rounded px-2 py-1 mr-2" />
          <button className="bg-teal-600 text-white px-3 py-1 rounded">검색</button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label className="mr-2">시설 유형:</label>
          <select className="border rounded p-1 mr-4">
            <option>전체</option>
            <option>정화조 악취저감시설</option>
            <option>맨홀 악취차단장치</option>
            <option>빗물받이 악취차단장치</option>
            <option>하수관로 악취저감장치</option>
          </select>
          
          <label className="mr-2">지역:</label>
          <select className="border rounded p-1">
            <option>전체</option>
            <option>수정구</option>
            <option>중원구</option>
            <option>분당구</option>
          </select>
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">관리번호</th>
              <th className="p-2 text-left">시설유형</th>
              <th className="p-2 text-left">설치위치</th>
              <th className="p-2 text-left">설치일자</th>
              <th className="p-2 text-left">점검주기</th>
              <th className="p-2 text-left">마지막 점검일</th>
              <th className="p-2 text-left">상태</th>
              <th className="p-2 text-left">조치</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">F-2023-0001</td>
              <td className="p-2">정화조 악취저감시설</td>
              <td className="p-2">수정구 태평동 3505</td>
              <td className="p-2">2023-06-15</td>
              <td className="p-2">3개월</td>
              <td className="p-2">2025-02-15</td>
              <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">정상</span></td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">상세</button>
                <button className="text-blue-600 hover:underline">점검</button>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">F-2023-0002</td>
              <td className="p-2">맨홀 악취차단장치</td>
              <td className="p-2">중원구 금광동 4286</td>
              <td className="p-2">2023-07-22</td>
              <td className="p-2">6개월</td>
              <td className="p-2">2025-01-22</td>
              <td className="p-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">점검필요</span></td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">상세</button>
                <button className="text-blue-600 hover:underline">점검</button>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">F-2023-0003</td>
              <td className="p-2">빗물받이 악취차단장치</td>
              <td className="p-2">수정구 신촌동 2856</td>
              <td className="p-2">2023-08-05</td>
              <td className="p-2">6개월</td>
              <td className="p-2">2025-02-05</td>
              <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">정상</span></td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">상세</button>
                <button className="text-blue-600 hover:underline">점검</button>
              </td>
            </tr>
            <tr>
              <td className="p-2">F-2023-0004</td>
              <td className="p-2">맨홀 단차부 낙차완화시설</td>
              <td className="p-2">중원구 상대원동 5623</td>
              <td className="p-2">2023-09-18</td>
              <td className="p-2">12개월</td>
              <td className="p-2">2024-09-18</td>
              <td className="p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">주의</span></td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">상세</button>
                <button className="text-blue-600 hover:underline">점검</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-4 flex justify-center">
          <div className="flex">
            <button className="border rounded px-3 py-1 mr-1">&lt;</button>
            <button className="border rounded px-3 py-1 mr-1 bg-teal-600 text-white">1</button>
            <button className="border rounded px-3 py-1 mr-1">2</button>
            <button className="border rounded px-3 py-1 mr-1">3</button>
            <button className="border rounded px-3 py-1">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityManagement;