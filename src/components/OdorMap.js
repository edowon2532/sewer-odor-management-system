import React, { useState } from 'react';

const OdorMap = () => {
  const [mapType, setMapType] = useState('odorGrade');
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">악취지도</h2>
      
      <div className="mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${mapType === 'odorGrade' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setMapType('odorGrade')}
          >
            악취 등급 지도
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${mapType === 'facility' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setMapType('facility')}
          >
            시설 지도
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${mapType === 'complaint' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setMapType('complaint')}
          >
            민원 지도
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${mapType === 'perception' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setMapType('perception')}
          >
            체감 지도
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between mb-4">
          <div>
            <label className="mr-2">구역:</label>
            <select className="border rounded p-1">
              <option>전체</option>
              <option>수정구</option>
              <option>중원구</option>
              <option>분당구</option>
            </select>
          </div>
          <div>
            <button className="bg-teal-600 text-white px-3 py-1 rounded mr-2">검색</button>
            <button className="bg-gray-200 px-3 py-1 rounded">필터</button>
          </div>
        </div>
        
        <div className="h-96 bg-gray-100 relative">
          {/* 지도 영역 */}
          <div className="absolute inset-0">
            <p className="flex items-center justify-center h-full text-gray-500">악취지도 표시 영역</p>
          </div>
          
          {/* 지도 범례 */}
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
            <p className="text-sm font-bold mb-1">등급 기준</p>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              <span className="text-xs">1등급 (쾌적)</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span className="text-xs">2등급 (양호)</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
              <span className="text-xs">3등급 (보통)</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-orange-500 mr-2"></div>
              <span className="text-xs">4등급 (불량)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span className="text-xs">5등급 (불쾌)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdorMap;