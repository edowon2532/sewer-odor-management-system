import React from 'react';

const ComplaintManagement = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">악취 민원 관리</h2>
      
      <div className="mb-4 flex justify-between">
        <div>
          <button className="bg-teal-600 text-white px-3 py-1 rounded mr-2">새 민원 등록</button>
          <button className="bg-gray-200 px-3 py-1 rounded">보고서 출력</button>
        </div>
        <div className="flex">
          <select className="border rounded p-1 mr-2">
            <option>전체 상태</option>
            <option>접수</option>
            <option>조사중</option>
            <option>처리중</option>
            <option>완료</option>
          </select>
          <input type="text" placeholder="검색어" className="border rounded px-2 py-1 mr-2" />
          <button className="bg-teal-600 text-white px-3 py-1 rounded">검색</button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">민원번호</th>
              <th className="p-2 text-left">지역</th>
              <th className="p-2 text-left">내용</th>
              <th className="p-2 text-left">접수일</th>
              <th className="p-2 text-left">민원인</th>
              <th className="p-2 text-left">담당자</th>
              <th className="p-2 text-left">상태</th>
              <th className="p-2 text-left">조치</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">C-2025-0142</td>
              <td className="p-2">수정구 태평동</td>
              <td className="p-2">하수관 맨홀 악취</td>
              <td className="p-2">2025-04-28</td>
              <td className="p-2">김주민</td>
              <td className="p-2">박시설</td>
              <td className="p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">처리중</span></td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">상세</button>
                <button className="text-blue-600 hover:underline">처리</button>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">C-2025-0141</td>
              <td className="p-2">중원구 금광동</td>
              <td className="p-2">빗물받이 악취</td>
              <td className="p-2">2025-04-26</td>
              <td className="p-2">이시민</td>
              <td className="p-2">박시설</td>
              <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">완료</span></td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">상세</button>
                <button className="text-blue-600 hover:underline">보고서</button>
              </td>
            </tr>
            <tr>
              <td className="p-2">C-2025-0140</td>
              <td className="p-2">수정구 신촌동</td>
              <td className="p-2">정화조 악취</td>
              <td className="p-2">2025-04-25</td>
              <td className="p-2">박주민</td>
              <td className="p-2">김담당</td>
              <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">완료</span></td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">상세</button>
                <button className="text-blue-600 hover:underline">보고서</button>
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

export default ComplaintManagement;