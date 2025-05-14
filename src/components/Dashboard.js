import React, { useMemo, useState, useEffect } from 'react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { FiMoreHorizontal, FiSettings } from 'react-icons/fi';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import 'chart.js/auto';

// 샘플 데이터 (광주광역시 남구)
const h2sData = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: [
    {
      label: '하수악취(H₂S, ppm)',
      data: Array.from({ length: 24 }, () => (0.03 + Math.random() * 0.04).toFixed(3)),
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34,211,238,0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};
const tempData = {
  labels: h2sData.labels,
  datasets: [
    {
      label: '기온(℃)',
      data: [17, 17.5, 18, 18.2, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 22, 21.5, 21, 20.5, 20, 19.5, 19, 18.5, 18, 17.5, 17],
      borderColor: '#818cf8',
      backgroundColor: 'rgba(129,140,248,0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};
// 바람장 레이더 차트 옵션 별도 지정
const windRadarOptions = {
  plugins: {
    legend: { display: true, labels: { color: '#e5e7eb' } },
    tooltip: { bodyColor: '#e5e7eb', titleColor: '#e5e7eb' }
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    r: {
      angleLines: { color: '#e5e7eb', display: true },
      grid: { color: 'rgba(229,231,235,0.2)' },
      pointLabels: { color: '#e5e7eb', font: { size: 16 } },
      ticks: { color: '#e5e7eb', display: false, stepSize: 2 },
      min: 0,
      max: 12
    }
  }
};
// 바람장 데이터셋도 fill: false, borderWidth: 4, pointRadius: 2, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.1)'
const windRadarData = {
  labels: ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동', '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서'],
  datasets: [
    {
      label: '풍속(㎧)',
      data: [2, 3, 5, 7, 6, 4, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2],
      fill: false,
      borderColor: '#60a5fa',
      borderWidth: 4,
      pointRadius: 2,
      backgroundColor: 'rgba(96,165,250,0.1)'
    },
  ],
};
const stationLabels = [
  '봉선동1', '봉선동2', '방림동1', '방림동2', '주월동1', '주월동2', '진월동1', '진월동2', '송암동1', '송암동2', '월산동1', '월산동2'
];
const stat24hData = {
  labels: h2sData.labels,
  datasets: [
    {
      label: '24시간 통계(ppm)',
      data: [10, 12, 13, 12, 14, 15, 17, 16, 15, 14, 13, 12, 11, 12, 13, 14, 15, 17, 18, 17, 16, 15, 14, 13],
      borderColor: '#fbbf24',
      backgroundColor: 'rgba(251,191,36,0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const airTableRows = [
  ['초미세먼지', '13㎍/㎥'],
  ['미세먼지', '11㎍/㎥'],
  ['총휘발성유기화합물', '0.01ppb'],
  ['풍향', '북동'],
  ['풍속', '0.69㎧'],
  ['온도', '17.89℃'],
  ['습도', '57.4%'],
];

// 등급별 색상 정의
const gradeColors = {
  '매우좋음': '#4CAF50',  // 녹색
  '좋음': '#8BC34A',      // 연한 녹색
  '보통': '#FFC107',      // 노란색
  '나쁨': '#FF9800',      // 주황색
  '매우나쁨': '#F44336'   // 빨간색
};

// 등급 산정 함수
function getOdorGrade(value) {
  if (value <= 0.005) return '매우좋음';
  if (value <= 0.01) return '좋음';
  if (value <= 0.1) return '보통';
  if (value <= 2.0) return '나쁨';
  return '매우나쁨';
}

// 마커 데이터에 등급, 마커라벨 추가
const markerPositions = [
  { lat: 35.1297, lng: 126.9122, label: '봉선동', markerLabel: 'P2', h2s: 0.15, temp: 23.5, humidity: 62.0 },
  { lat: 35.1331, lng: 126.9201, label: '방림동', markerLabel: 'P0', h2s: 0.008, temp: 24.2, humidity: 58.5 },
  { lat: 35.1142, lng: 126.9028, label: '주월동', markerLabel: 'A', h2s: 2.5, temp: 22.8, humidity: 65.0 },
  { lat: 35.1207, lng: 126.9163, label: '진월동', markerLabel: 'P2', h2s: 0.08, temp: 23.0, humidity: 60.0 },
  { lat: 35.1108, lng: 126.9215, label: '송암동', markerLabel: 'P0', h2s: 0.004, temp: 24.0, humidity: 57.0 },
  { lat: 35.1257, lng: 126.9062, label: '월산동', markerLabel: 'P2', h2s: 0.12, temp: 23.8, humidity: 59.0 },
].map(pos => ({
  ...pos,
  grade: getOdorGrade(pos.h2s)
}));

// 밝은 회색 차트 옵션 공통 객체
const chartOptions = {
  plugins: {
    legend: { labels: { color: '#e5e7eb' } },
    tooltip: { bodyColor: '#e5e7eb', titleColor: '#e5e7eb' }
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: { ticks: { color: '#e5e7eb' }, grid: { color: 'rgba(229,231,235,0.2)' } },
    y: { ticks: { color: '#e5e7eb' }, grid: { color: 'rgba(229,231,235,0.2)' }, beginAtZero: true }
  }
};

// 민원접수 현황용 읍면동 리스트
const eupmyeondongList = [
  '봉선동', '방림동', '주월동', '진월동', '송암동', '월산동'
];
// 민원접수 건수 예시 데이터 (지역별)
const civilComplaintData = {
  labels: eupmyeondongList,
  datasets: [
    {
      label: '민원접수 건수',
      data: [12, 7, 15, 9, 4, 11],
      backgroundColor: '#FFC107', // 노란색으로 통일
    },
  ],
};
// 시간대별 민원접수 예시 데이터
const hours = Array.from({ length: 24 }, (_, i) => `${i}시`);
const civilComplaintByHourData = {
  labels: hours,
  datasets: [
    {
      label: '민원접수 건수',
      data: [1, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 5, 4, 3, 2, 2, 1, 1, 0, 0, 0, 0],
      borderColor: '#FFC107',
      backgroundColor: 'rgba(255,193,7,0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

// 풍향/풍속 캐로셀 컴포넌트
const WindCarousel = ({ windRadarData, windRadarOptions }) => {
  const [slide, setSlide] = useState(0);
  const [arrowInfo, setArrowInfo] = useState({
    windDirIdx: Math.floor(Math.random() * 16),
    windSpeed: Math.floor(Math.random() * 10) + 1 // 1~10 m/s
  });
  const directions = ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동', '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서'];
  const windDir = arrowInfo.windDirIdx * 22.5;

  // 2번 슬라이드 진입 시마다 랜덤값 갱신
  useEffect(() => {
    if (slide === 1) {
      setArrowInfo({
        windDirIdx: Math.floor(Math.random() * 16),
        windSpeed: Math.floor(Math.random() * 10) + 1
      });
    }
  }, [slide]);

  // 데이터 없는 레이더 차트 옵션(눈금만, 80% 크기)
  const radarBgOptions = {
    ...windRadarOptions,
    plugins: { ...windRadarOptions.plugins, legend: { display: false } },
    scales: {
      r: {
        ...windRadarOptions.scales.r,
        pointLabels: { color: '#e5e7eb', font: { size: 16 } },
        grid: { color: 'rgba(229,231,235,0.2)' },
        angleLines: { color: '#e5e7eb', display: true },
        ticks: { color: '#e5e7eb', display: false, stepSize: 2 },
        min: 0,
        max: 12
      }
    }
  };
  const radarBgData = {
    labels: windRadarData.labels,
    datasets: []
  };

  // 2번 슬라이드: 눈금만 있는 레이더 차트(80%) + 화살표 + 하단 텍스트
  const ArrowChart = () => (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none flex items-center justify-center">
        <div style={{ width: '90%', height: '90%' }}>
          <Radar data={radarBgData} options={radarBgOptions} className="h-full w-full" />
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <g transform={`rotate(${windDir},90,90)`}>
            <line x1="90" y1="90" x2="90" y2="30" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            <polygon points="90,18 82,38 98,38" fill="#38bdf8" />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-2 left-4 text-sky-400 font-bold text-base">풍속 {arrowInfo.windSpeed} m/s</div>
      <div className="absolute bottom-2 right-4 text-sky-400 font-bold text-base">풍향 {directions[arrowInfo.windDirIdx]}</div>
    </div>
  );

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => setSlide(s => (s === 0 ? 1 : 0))}
          className="rounded-full p-1 shadow text-gray-500"
          style={{ opacity: 0.7 }}
        >〈</button>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => setSlide(s => (s === 0 ? 1 : 0))}
          className="rounded-full p-1 shadow text-gray-500"
          style={{ opacity: 0.7 }}
        >〉</button>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {slide === 0 ? (
          <Radar data={windRadarData} options={windRadarOptions} className="h-full w-full" />
        ) : (
          <ArrowChart />
        )}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <span className={`w-2 h-2 rounded-full ${slide === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
        <span className={`w-2 h-2 rounded-full ${slide === 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // 측정소별 H₂S 데이터 ('보통', '나쁨' 구간만 랜덤 분포)
  const randomStationData = useMemo(() => {
    const getRandom = (min, max) => Number((Math.random() * (max - min) + min).toFixed(3));
    // 12개 측정소에 대해 보통/나쁨 구간 랜덤값 번갈아 할당
    const values = [];
    for (let i = 0; i < stationLabels.length; i++) {
      if (i % 2 === 0) {
        values.push(getRandom(0.011, 0.1)); // 보통
      } else {
        values.push(getRandom(0.101, 2.0)); // 나쁨
      }
    }
    return values;
  }, []);
  // 농도별 색상 구분
  const getH2SColor = (value) => {
    if (value >= 0.8) return '#ef4444'; // 적색
    if (value >= 0.6) return '#f59e42'; // 주황색
    if (value >= 0.4) return '#fde047'; // 노란색
    if (value >= 0.2) return '#22c55e'; // 녹색
    return '#3b82f6'; // 파란색
  };
  // 측정소별 H₂S 데이터 색상 등급별로 부여
  const stationBarData = useMemo(() => {
    return {
      labels: stationLabels,
      datasets: [
        {
          label: 'H₂S(ppm)',
          data: randomStationData,
          backgroundColor: randomStationData.map(getOdorGrade).map(grade => gradeColors[grade]),
        },
      ],
    };
  }, [randomStationData]);

  // 랜덤 센서 작동 데이터 생성
  const randomSensorData = useMemo(() =>
    Array.from({ length: stationLabels.length }, () => Math.floor(Math.random() * 41) + 20),
    []
  );
  const sensorBarData = {
    labels: stationLabels,
    datasets: [
      {
        label: '작동 시간(분)',
        data: randomSensorData,
        backgroundColor: '#38bdf8',
      },
    ],
  };

  // 민원접수 현황 구분 상태
  const [complaintViewType, setComplaintViewType] = useState('시간대별');

  return (
    <div className="h-full w-full p-2 md:p-3 lg:p-4 box-border overflow-y-auto bg-[#4B5563]">
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 lg:gap-4 h-[98.2%]"
      >
        {/* 좌측 카드 */}
        <div className="md:col-span-3 flex flex-col gap-y-2 md:gap-y-3 lg:gap-y-4 w-full md:h-full min-h-0">
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 relative w-full flex-[1.5_1_0%] min-h-[60vw] md:min-h-[220px] aspect-[4/3] md:aspect-auto flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-100">하수악취(H₂S)</span>
              <FiMoreHorizontal className="text-gray-200" />
            </div>
            <div className="flex-1 min-h-0">
              <Line data={h2sData} options={chartOptions} className="h-full w-full" />
            </div>
          </div>
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 relative w-full flex-[1.5_1_0%] min-h-[60vw] md:min-h-[220px] aspect-[4/3] md:aspect-auto flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-100">기온</span>
              <FiMoreHorizontal className="text-gray-200" />
            </div>
            <div className="flex-1 min-h-0">
              <Line data={tempData} options={chartOptions} className="h-full w-full" />
            </div>
          </div>
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 relative w-full flex-[2_1_0%] min-h-[60vw] md:min-h-[220px] aspect-[4/3] md:aspect-auto flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-100">풍향/풍속</span>
              <FiMoreHorizontal className="text-gray-200" />
            </div>
            <div className="flex-1 min-h-0">
              <WindCarousel windRadarData={windRadarData} windRadarOptions={windRadarOptions} />
            </div>
          </div>
        </div>
        {/* 중앙 지도 */}
        <div className="md:col-span-6 flex flex-col gap-y-2 md:gap-y-3 lg:gap-y-4 w-full md:h-full">
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 flex-[3_1_0%] flex flex-col relative w-full min-h-[60vw] md:min-h-[300px] aspect-[4/3] md:aspect-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white/90">현장상황판 - 광주광역시 남구</span>
              <FiSettings className="text-gray-400" />
            </div>
            <div className="flex-1 min-h-0 bg-gray-900/40 rounded-xl overflow-hidden relative">
              <Map // 카카오 지도
                center={{ lat: 35.1264, lng: 126.9117 }}
                style={{ width: '100%', height: '100%' }}
                level={6}
                mapTypeId="HYBRID"
              >
                {/* 지도 마커, 라벨, 범례 등 모두 삭제 */}
              </Map>
            </div>
          </div>
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 flex-1 min-h-[60vw] md:min-h-0 flex flex-col aspect-[4/3] md:aspect-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-100">측정소별 H₂S</span>
              <FiMoreHorizontal className="text-gray-200" />
            </div>
            <div className="flex-1 min-h-0">
              <Bar data={stationBarData} options={chartOptions} className="h-full w-full" />
            </div>
          </div>
        </div>
        {/* 우측 카드 */}
        <div className="md:col-span-3 flex flex-col gap-y-2 md:gap-y-3 lg:gap-y-4 w-full md:h-full">
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 relative w-full flex-1 min-h-[60vw] md:min-h-0 flex flex-col aspect-[4/3] md:aspect-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-100">민원접수 현황</span>
              <div className="flex items-center gap-2">
                <select
                  className="bg-[#232A36] text-white text-sm rounded px-2 py-1 focus:outline-none border border-gray-600"
                  value={complaintViewType}
                  onChange={e => setComplaintViewType(e.target.value)}
                >
                  <option value="지역별">지역별</option>
                  <option value="시간대별">시간대별</option>
                </select>
                <FiMoreHorizontal className="text-gray-200" />
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {complaintViewType === '지역별' ? (
                <Bar data={civilComplaintData} options={chartOptions} className="h-full w-full" />
              ) : (
                <Line data={civilComplaintByHourData} options={chartOptions} className="h-full w-full" />
              )}
            </div>
            <div className="flex justify-end mt-2">
              <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">민원접수 건수</span>
            </div>
          </div>
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 relative w-full flex-1 min-h-[60vw] md:min-h-0 flex flex-col aspect-[4/3] md:aspect-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-100">저감시설 작동현황</span>
              <FiMoreHorizontal className="text-gray-200" />
            </div>
            <div className="flex-1 min-h-0">
              <Bar data={sensorBarData} options={chartOptions} className="h-full w-full" />
            </div>
            <div className="flex justify-end mt-2">
              <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">작동 시간(분)</span>
            </div>
          </div>
          <div className="rounded-2xl bg-[#2C3440] shadow-xl p-4 relative w-full flex-1 min-h-[60vw] md:min-h-0 flex flex-col aspect-[4/3] md:aspect-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-100">시설/장치 원격 제어</span>
              <FiSettings className="text-gray-200" />
            </div>
            <div className="space-y-2">
              {['저감시설-01', '저감시설-02', '저감시설-03', '저감시설-04'].map((name, i) => (
                <div key={name} className="flex items-center justify-between bg-[#181C24] rounded-lg px-3 py-2">
                  <span className="text-gray-200 font-semibold">{name}</span>
                  <span className={`w-3 h-3 rounded-full mr-2 ${i === 3 ? 'bg-[#F44336]' : (i % 2 === 0 ? 'bg-green-400' : 'bg-gray-400')}`}></span>
                  <button
                    className={`w-24 px-4 py-1.5 rounded text-base font-semibold ${i === 1 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'}`}
                  >
                    {i === 1 ? 'On' : (i === 3 ? '상태이상' : 'Off')}
                  </button>
                </div>
              ))}
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;