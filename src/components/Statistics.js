import React from 'react';

const Statistics = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">악취 통계 분석</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">월별 악취 발생 추이</h3>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">월별 악취 발생 그래프</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">지역별 악취 발생 현황</h3>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">지역별 악취 발생 그래프</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">시간대별 악취 발생 분포</h3>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">시간대별 악취 발생 그래프</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">악취 유형별 민원 분포</h3>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">유형별 민원 분포 그래프</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">악취저감시설 효과 분석</h3>
        <div className="mb-4">
          <label className="mr-2">시설 유형:</label>
          <select className="border rounded p-1 mr-4">
            <option>전체</option>
            <option>정화조 악취저감시설</option>
            <option>맨홀 악취차단장치</option>
            <option>빗물받이 악취차단장치</option>
            <option>맨홀 단차부 낙차완화시설</option>
          </select>
          
          <label className="mr-2">지역:</label>
          <select className="border rounded p-1 mr-4">
            <option>전체</option>
            <option>수정구</option>
            <option>중원구</option>
            <option>분당구</option>
          </select>
          
          <label className="mr-2">기간:</label>
          <input type="date" className="border rounded p-1 mr-1" />
          <span className="mr-1">~</span>
          <input type="date" className="border rounded p-1 mr-2" />
          
          <button className="bg-teal-600 text-white px-3 py-1 rounded">분석</button>
        </div>
        
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">악취저감시설 효과 분석 그래프</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;