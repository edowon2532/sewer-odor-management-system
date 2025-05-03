import React from 'react';

const Settings = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">시스템 설정</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">사용자 관리</h3>
          <div className="mb-4">
            <button className="bg-teal-600 text-white px-3 py-1 rounded mr-2">새 사용자 추가</button>
            <button className="bg-gray-200 px-3 py-1 rounded">권한 관리</button>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">이름</th>
                <th className="p-2 text-left">부서</th>
                <th className="p-2 text-left">권한</th>
                <th className="p-2 text-left">최종 접속</th>
                <th className="p-2 text-left">조치</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">admin</td>
                <td className="p-2">관리자</td>
                <td className="p-2">시스템관리</td>
                <td className="p-2">관리자</td>
                <td className="p-2">2025-05-02 09:15</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline mr-2">수정</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">user001</td>
                <td className="p-2">김담당</td>
                <td className="p-2">하수관리</td>
                <td className="p-2">일반</td>
                <td className="p-2">2025-05-02 10:22</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline mr-2">수정</button>
                </td>
              </tr>
              <tr>
                <td className="p-2">user002</td>
                <td className="p-2">박시설</td>
                <td className="p-2">악취관리</td>
                <td className="p-2">관리자</td>
                <td className="p-2">2025-05-01 16:45</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline mr-2">수정</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">시스템 설정</h3>
          
          <div className="mb-4">
            <h4 className="font-bold mb-2">알림 설정</h4>
            <div className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>악취 농도 높음 알림 (4등급 이상)</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>민원 접수 알림</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>시설 점검 필요 알림</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold mb-2">데이터 백업</h4>
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-2">마지막 백업: 2025-05-01 23:00</p>
              <button className="bg-teal-600 text-white px-3 py-1 rounded">백업 실행</button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">데이터 연동 설정</h4>
            <div className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>GIS 시스템 연동</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>하수관리시스템 연동</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>민원관리시스템 연동</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;