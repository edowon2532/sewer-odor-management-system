import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  // 월별 악취 발생 건수 데이터
  const monthlyData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '악취 발생 건수',
        data: [12, 19, 15, 17, 22, 25],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 지역별 악취 발생 비율 데이터
  const areaData = {
    labels: ['봉선동', '주월동', '방림동', '양림동', '구동'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">악취 통계 분석</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">월별 악취 발생 건수</h3>
          <div className="h-80">
            <Bar data={monthlyData} options={{
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
                    text: '발생 건수'
                  }
                }
              }
            }} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">지역별 악취 발생 비율</h3>
          <div className="h-80">
            <Doughnut data={areaData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: false,
                },
              },
            }} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">악취 발생 유형별 통계</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">유형</th>
                <th className="p-2 text-left">발생 건수</th>
                <th className="p-2 text-left">비율</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">맨홀 악취</td>
                <td className="p-2">45</td>
                <td className="p-2">35%</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">빗물받이 악취</td>
                <td className="p-2">38</td>
                <td className="p-2">30%</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">정화조 악취</td>
                <td className="p-2">25</td>
                <td className="p-2">20%</td>
              </tr>
              <tr>
                <td className="p-2">기타</td>
                <td className="p-2">17</td>
                <td className="p-2">15%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">악취 등급별 분포</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">등급</th>
                <th className="p-2 text-left">발생 건수</th>
                <th className="p-2 text-left">비율</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">1등급 (무취)</td>
                <td className="p-2">15</td>
                <td className="p-2">12%</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">2등급 (약한 악취)</td>
                <td className="p-2">45</td>
                <td className="p-2">36%</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">3등급 (중간 악취)</td>
                <td className="p-2">38</td>
                <td className="p-2">30%</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">4등급 (강한 악취)</td>
                <td className="p-2">20</td>
                <td className="p-2">16%</td>
              </tr>
              <tr>
                <td className="p-2">5등급 (매우 강한 악취)</td>
                <td className="p-2">7</td>
                <td className="p-2">6%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;