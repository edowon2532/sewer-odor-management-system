import React from 'react';

const RealTimeMonitoring = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">실시간 악취 모니터링</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h3 className="text-lg font-bold mb-2">실시간 측정 현황</h3>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">악취 측정 그래프</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">알림 현황</h3>
          <div className="max-h-64 overflow-y-auto">
            <div className="border-b p-2">
              <div className="flex justify-between">
                <span className="text-red-600 font-bold">⚠️ 경고</span>
                <span className="text-sm text-gray-500">15:32</span>
              </div>
              <p className="text-sm">태평동 맨홀 M-342 악취 등급 5 초과</p>
            </div>
            <div className="border-b p-2">
              <div className="flex justify-between">
                <span className="text-yellow-600 font-bold">⚠️ 주의</span>
                <span className="text-sm text-gray-500">14:58</span>
              </div>
              <p className="text-sm">금광동 정화조 F-128 악취 농도 상승 중</p>
            </div>
            <div className="border-b p-2">
              <div className="flex justify-between">
                <span className="text-green-600 font-bold">✓ 정상화</span>
                <span className="text-sm text-gray-500">14:45</span>
              </div>
              <p className="text-sm">상대원동 맨홀 M-156 악취 등급 정상화</p>
            </div>
            <div className="border-b p-2">
              <div className="flex justify-between">
                <span className="text-yellow-600 font-bold">⚠️ 주의</span>
                <span className="text-sm text-gray-500">13:22</span>
              </div>
              <p className="text-sm">신촌동 빗물받이 R-087 악취 농도 상승</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">고농도 악취 발생 지점</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">지점</th>
                <th className="p-2 text-left">시설유형</th>
                <th className="p-2 text-left">현재 H₂S 농도</th>
                <th className="p-2 text-left">등급</th>
                <th className="p-2 text-left">24시간 변화</th>
                <th className="p-2 text-left">조치</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">태평동 M-342</td>
                <td className="p-2">맨홀</td>
                <td className="p-2">15 ppm</td>
                <td className="p-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">5등급</span></td>
                <td className="p-2">
                  <div className="h-6 bg-gray-100">그래프</div>
                </td>
                <td className="p-2">
                  <button className="bg-red-600 text-white px-2 py-1 rounded text-sm">긴급조치</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">금광동 F-128</td>
                <td className="p-2">정화조</td>
                <td className="p-2">8 ppm</td>
                <td className="p-2"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">4등급</span></td>
                <td className="p-2">
                  <div className="h-6 bg-gray-100">그래프</div>
                </td>
                <td className="p-2">
                  <button className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">조치필요</button>
                </td>
              </tr>
              <tr>
                <td className="p-2">신촌동 R-087</td>
                <td className="p-2">빗물받이</td>
                <td className="p-2">6 ppm</td>
                <td className="p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">3등급</span></td>
                <td className="p-2">
                  <div className="h-6 bg-gray-100">그래프</div>
                </td>
                <td className="p-2">
                  <button className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">조치필요</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;