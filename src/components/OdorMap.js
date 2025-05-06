import React, { useState, useEffect, useRef } from 'react';
import { Map, MapMarker, Roadview, Circle } from 'react-kakao-maps-sdk';
import { Line, Bar } from 'react-chartjs-2';

const OdorMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 35.1264, lng: 126.9117 });
  const [showRoadview, setShowRoadview] = useState(false);
  const [roadviewPosition, setRoadviewPosition] = useState(null);
  const [roadviewError, setRoadviewError] = useState(false);
  const [mapType, setMapType] = useState('normal');
  const [selectedTab, setSelectedTab] = useState('악취 등급 지도');
  const [selectedPipeInfo, setSelectedPipeInfo] = useState(null);
  const mapRef = useRef(null);
  const roadviewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = 4;
  const [showPipeModal, setShowPipeModal] = useState(false);
  const [showOdor, setShowOdor] = useState(true);
  const [showPipe, setShowPipe] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showOdorList, setShowOdorList] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=a9651c8c7e59c947ac88c6a668b5f0fb&libraries=services,clusterer,drawing`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // 탭이 변경될 때마다 상태 초기화
    setSelectedLocation(null);
    setSelectedPipeInfo(null);
    setShowRoadview(false);
  }, [selectedTab]);

  // 광주 남구 중심 좌표
  const center = {
    lat: 35.1264,
    lng: 126.9117
  };

  // 악취 발생 지점 데이터
  const odorLocations = [
    {
      id: 1,
      type: '거점형',
      markerLabel: 'P2',
      name: '봉선동 악취 측정지점',
      position: { lat: 35.1300, lng: 126.9108 },
      grade: '경계',
      value: 2.35,
      nh3: 0.512,
      h2s: 2.148,
      co2: 0.256,
      timeSeries: [1.2, 1.5, 2.0, 2.35, 2.1, 1.8],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 2,
      type: '거점형',
      markerLabel: 'P0',
      name: '방림동 악취 측정지점',
      position: { lat: 35.1334, lng: 126.9212 },
      grade: '좋음',
      value: 0.98,
      nh3: 0.125,
      h2s: 1.018,
      co2: 0.123,
      timeSeries: [0.8, 0.9, 1.0, 0.98, 0.95, 0.9],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 3,
      type: '지역형',
      markerLabel: 'A',
      name: '주월동 악취 측정지점',
      position: { lat: 35.1134, lng: 126.9012 },
      grade: '나쁨',
      value: 3.12,
      nh3: 1.055,
      h2s: 2.365,
      co2: 0.512,
      timeSeries: [2.5, 2.8, 3.0, 3.12, 3.0, 2.9],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 4,
      type: '거점형',
      markerLabel: 'P2',
      name: '진월동 악취 측정지점',
      position: { lat: 35.1200, lng: 126.9150 },
      grade: '보통',
      value: 1.45,
      nh3: 0.312,
      h2s: 1.245,
      co2: 0.200,
      timeSeries: [1.1, 1.2, 1.3, 1.45, 1.4, 1.3],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 5,
      type: '거점형',
      markerLabel: 'P0',
      name: '송암동 악취 측정지점',
      position: { lat: 35.1100, lng: 126.9200 },
      grade: '매우좋음',
      value: 0.55,
      nh3: 0.050,
      h2s: 0.500,
      co2: 0.100,
      timeSeries: [0.4, 0.5, 0.6, 0.55, 0.5, 0.45],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 6,
      type: '거점형',
      markerLabel: 'P2',
      name: '월산동 악취 측정지점',
      position: { lat: 35.1250, lng: 126.9050 },
      grade: '경계',
      value: 2.10,
      nh3: 0.400,
      h2s: 2.000,
      co2: 0.300,
      timeSeries: [1.8, 1.9, 2.0, 2.1, 2.0, 1.9],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 7,
      type: '거점형',
      markerLabel: 'P0',
      name: '백운동 악취 측정지점',
      position: { lat: 35.1280, lng: 126.9180 },
      grade: '좋음',
      value: 1.00,
      nh3: 0.200,
      h2s: 1.000,
      co2: 0.150,
      timeSeries: [0.9, 1.0, 1.1, 1.0, 0.95, 0.9],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 8,
      type: '지역형',
      markerLabel: 'A',
      name: '양림동 악취 측정지점',
      position: { lat: 35.1350, lng: 126.9150 },
      grade: '보통',
      value: 1.60,
      nh3: 0.350,
      h2s: 1.400,
      co2: 0.180,
      timeSeries: [1.3, 1.4, 1.5, 1.6, 1.5, 1.4],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 9,
      type: '지역형',
      markerLabel: 'A',
      name: '사직동 악취 측정지점',
      position: { lat: 35.1400, lng: 126.9000 },
      grade: '나쁨',
      value: 3.00,
      nh3: 1.000,
      h2s: 2.800,
      co2: 0.600,
      timeSeries: [2.7, 2.8, 2.9, 3.0, 2.9, 2.8],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 10,
      type: '거점형',
      markerLabel: 'P2',
      name: '대촌동 악취 측정지점',
      position: { lat: 35.1150, lng: 126.9300 },
      grade: '경계',
      value: 2.50,
      nh3: 0.600,
      h2s: 2.300,
      co2: 0.350,
      timeSeries: [2.2, 2.3, 2.4, 2.5, 2.4, 2.3],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    },
    {
      id: 11,
      type: '거점형',
      markerLabel: 'P0',
      name: '송하동 악취 측정지점',
      position: { lat: 35.1180, lng: 126.9120 },
      grade: '매우좋음',
      value: 0.70,
      nh3: 0.080,
      h2s: 0.600,
      co2: 0.120,
      timeSeries: [0.6, 0.7, 0.8, 0.7, 0.65, 0.6],
      labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    }
  ];

  // 하수관로 시설 데이터 추가
  const pipeLocations = [
    {
      id: 1,
      name: '봉선동 하수관로',
      position: { lat: 35.1305, lng: 126.9115 },
      type: '하수관로'
    },
    {
      id: 2,
      name: '방림동 하수관로',
      position: { lat: 35.1338, lng: 126.9215 },
      type: '하수관로'
    },
    {
      id: 3,
      name: '주월동 하수관로',
      position: { lat: 35.1138, lng: 126.9015 },
      type: '하수관로'
    }
  ];

  // 악취 발생 목록 페이징 처리
  const pagedOdorLocations = odorLocations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowComplaints(false);
    setMapCenter(location.position);
    if (mapRef.current) {
      mapRef.current.setLevel(3);
    }
  };

  const findNearestRoadview = (position) => {
    return new Promise((resolve, reject) => {
      if (!window.kakao || !window.kakao.maps) {
        reject(new Error('카카오맵 API가 로드되지 않았습니다.'));
        return;
      }

      const roadviewService = new window.kakao.maps.RoadviewService();
      roadviewService.getNearestPanoId(position.lng, position.lat, 50, (status, panoId) => {
        if (status === window.kakao.maps.services.Status.OK) {
          roadviewService.getPanoInfo(panoId, (status, panoInfo) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve({
                lat: panoInfo.lat,
                lng: panoInfo.lng
              });
            } else {
              reject(new Error('로드뷰 정보를 가져올 수 없습니다.'));
            }
          });
        } else {
          reject(new Error('가장 가까운 로드뷰를 찾을 수 없습니다.'));
        }
      });
    });
  };

  const toggleRoadview = async () => {
    if (selectedLocation) {
      try {
        const nearestPosition = await findNearestRoadview(selectedLocation.position);
        setRoadviewPosition(nearestPosition);
        setRoadviewError(false);
      } catch (error) {
        setRoadviewPosition(null);
        setRoadviewError(true);
      }
      setShowRoadview(true);
    } else {
      setShowRoadview(false);
    }
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    if (mapRef.current && window.kakao?.maps?.MapTypeId) {
      mapRef.current.setMapTypeId(window.kakao.maps.MapTypeId[type.toUpperCase()]);
    }
  };

  // 탭 메뉴 항목 정의
  const tabMenu = [
    { label: '악취 등급 지도' },
    { label: '시설 지도' },
    { label: '민원 지도' },
    { label: '체감 지도' }
  ];

  // 하수관거대장 예시 데이터
  const pipeInfoExample = {
    관리번호: '710093497',
    도엽번호: '356161129D',
    설치일자: '2016-04-25',
    관리기관: '광산구',
    설치위치: '광산구 송정2동',
    행정동: '광산구 송정2동',
    공사명: '송정역~국도13호선 도로개설공사',
    등록자: '등록자',
    등록일자: '2016-04-25',
    최종수정자: '최종수정자',
    최종수정일자: '2016-04-25',
    오수관: '오수관',
    관재질: '미분류',
    단면형태: '원형',
    구경: '300',
    연장: '41.28',
    기초깊이: '0.00',
    세로길이: '0.00',
    시공전장: '0.00',
    중점깊이: '0.00',
    시공후장: '0.00',
    평균구배: '0.00',
    시공결과: '도로건설',
    최종조성일: '2016-04-25',
    처리구명: '송정',
    처리구명2: '송정 송정분구',
    노면재질: '처리구명',
    청천시유속: '0.0',
    청천시유속2: '0.0',
    계획연장: '0.0',
    배수구명: '송정',
    사전관로명: '사전관로명',
    관련번호: '',
    시설: '중점',
    탐사종류: '탐사종류',
    성과심사고시번호: '',
    시점관로번호: '670001238',
    종점관로번호: '670001239',
  };

  const handlePipeMarkerClick = (location) => {
    if (selectedTab === '시설 지도') {
      setSelectedPipeInfo(pipeInfoExample);
      setMapCenter(location.position);
      if (mapRef.current) {
        mapRef.current.setLevel(3);
      }
    }
  };

  // 악취 등급별 마커 색상 반환 함수
  const getMarkerIconByGrade = (grade) => {
    switch (grade) {
      case '매우좋음': return 'https://upload.wikimedia.org/wikipedia/commons/5/50/Blue_circle.png';
      case '좋음': return 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Green_circle.png';
      case '보통': return 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Yellow_circle.png';
      case '경계': return 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Orange_circle.png';
      case '나쁨': return 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Red_circle.png';
      default: return 'https://upload.wikimedia.org/wikipedia/commons/5/50/Blue_circle.png';
    }
  };

  const getLabelColor = (grade) => {
    switch (grade) {
      case '매우좋음': return '#2563eb';
      case '좋음': return '#16a34a';
      case '보통': return '#eab308';
      case '경계': return '#f59e42';
      case '나쁨': return '#dc2626';
      default: return '#6d28d9';
    }
  };

  // 샘플 기상 데이터
  const weather = {
    windDir: 45,
    windSpeed: 2.3,
    temp: 23.5,
    humidity: 62
  };

  // 샘플 민원 포인트 데이터 (위치, 이름)
  const complaintPoints = [
    { id: 1, name: '민원1', position: { lat: 35.1302, lng: 126.9110 } },
    { id: 2, name: '민원2', position: { lat: 35.1298, lng: 126.9095 } },
    { id: 3, name: '민원3', position: { lat: 35.1312, lng: 126.9118 } },
    { id: 4, name: '민원4', position: { lat: 35.1332, lng: 126.9212 } },
    { id: 5, name: '민원5', position: { lat: 35.1136, lng: 126.9012 } },
    { id: 6, name: '민원6', position: { lat: 35.1305, lng: 126.9125 } },
    { id: 7, name: '민원7', position: { lat: 35.1295, lng: 126.9085 } },
    { id: 8, name: '민원8', position: { lat: 35.1315, lng: 126.9130 } },
    { id: 9, name: '민원9', position: { lat: 35.1335, lng: 126.9220 } },
    { id: 10, name: '민원10', position: { lat: 35.1132, lng: 126.9005 } },
    { id: 11, name: '민원11', position: { lat: 35.1308, lng: 126.9135 } },
    { id: 12, name: '민원12', position: { lat: 35.1292, lng: 126.9075 } },
    { id: 13, name: '민원13', position: { lat: 35.1318, lng: 126.9140 } },
    { id: 14, name: '민원14', position: { lat: 35.1338, lng: 126.9228 } },
    { id: 15, name: '민원15', position: { lat: 35.1128, lng: 126.8998 } }
  ];

  // 탭별로 보여줄 내용 정의
  const renderTabContent = () => {
    if (selectedTab === '악취 등급 지도') {
      return (
        <div className="absolute inset-0">
          {/* 레이어 콘트롤 */}
          <div className="absolute left-4 top-24 bg-white rounded shadow p-2 z-40 min-w-[180px]">
            <div className="font-bold text-base mb-2 flex items-center justify-between">
              <span>레이어 관리</span>
              <button className="ml-2 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded font-semibold" title="설정">설정</button>
            </div>
            <label className="block"><input type="checkbox" checked={showOdor} onChange={e => setShowOdor(e.target.checked)} /> 악취측정지점</label>
            <label className="block"><input type="checkbox" checked={showOdorList} onChange={e => setShowOdorList(e.target.checked)} /> 악취 발생 현황</label>
            <div className="mt-1">
              <label className="block font-semibold"><input type="checkbox" checked={showPipe} onChange={e => setShowPipe(e.target.checked)} /> 하수시설</label>
              <div className="ml-6 mt-1 space-y-1 text-sm">
                <label className="block"><input type="checkbox" disabled /> 하수관거</label>
                <label className="block"><input type="checkbox" disabled /> 맨홀</label>
                <label className="block"><input type="checkbox" disabled /> 빗물받이</label>
                <label className="block"><input type="checkbox" disabled /> 도로면</label>
              </div>
            </div>
            <label className="block mt-1"><input type="checkbox" checked={showWeather} onChange={e => setShowWeather(e.target.checked)} /> 기상정보</label>
          </div>
          <Map
            center={mapCenter}
            style={{ width: '100%', height: '100%' }}
            level={4}
            ref={mapRef}
            mapTypeId={window.kakao?.maps?.MapTypeId?.[mapType.toUpperCase()]}
          >
            {/* 악취지점 마커 (SVG로 직접 그림) */}
            {showOdor && odorLocations.map((location) => (
              <MapMarker
                key={location.id}
                position={location.position}
                onClick={() => handleLocationClick(location)}
              >
                <div className="relative flex flex-row items-center bg-transparent">
                  <svg width="40" height="40">
                    <circle cx="20" cy="20" r="16" fill={getLabelColor(location.grade)} stroke="none" />
                    <text x="20" y="26" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fff">{location.markerLabel}</text>
                  </svg>
                  <div className="flex justify-center items-center h-8 min-w-[40px] text-lg font-bold ml-2 bg-white/90 rounded-full" style={{color: getLabelColor(location.grade), pointerEvents: 'none'}}>
                    <span className="mr-1 align-middle text-xs text-black">H₂S</span> {location.value}
                  </div>
                </div>
              </MapMarker>
            ))}
            {/* 주변 민원현황: 버튼 클릭 시에만 반경/민원지점 표시 */}
            {selectedLocation && showComplaints && (
              <>
                <Circle
                  center={selectedLocation.position}
                  radius={300}
                  strokeWeight={2}
                  strokeColor="#14b8a6"
                  strokeOpacity={0.7}
                  fillColor="#14b8a6"
                  fillOpacity={0.5}
                />
                {complaintPoints.filter(
                  p => Math.sqrt(
                    Math.pow((p.position.lat - selectedLocation.position.lat) * 111000, 2) +
                    Math.pow((p.position.lng - selectedLocation.position.lng) * 88000, 2)
                  ) <= 300
                ).map(p => (
                  <MapMarker
                    key={`complaint-${p.id}`}
                    position={p.position}
                    image={{
                      src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                      size: { width: 24, height: 35 }
                    }}
                  />
                ))}
              </>
            )}
            {/* 하수관거 마커 (예시, 기존 pipeLocations 활용) */}
            {showPipe && pipeLocations.map((location) => (
              <MapMarker
                key={`pipe-${location.id}`}
                position={location.position}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                  size: { width: 24, height: 35 }
                }}
              />
            ))}
          </Map>
          {/* 기상상황 */}
          {showWeather && (
            <div className="absolute left-4 bottom-4 bg-white rounded p-4 z-40 min-w-[220px] flex flex-col items-center shadow-md shadow-gray-300/40">
              <div className="font-bold mb-2">기상상황</div>
              {/* 바람 방향 SVG */}
              <div className="flex flex-col items-center mb-2">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="28" fill="#f3f4f6" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="30" y1="30" x2="30" y2="8" stroke="#2563eb" strokeWidth="4" transform={`rotate(${weather.windDir} 30 30)`} />
                  <text x="30" y="15" textAnchor="middle" fontSize="12" fill="#64748b">N</text>
                </svg>
                <div className="text-xs text-gray-500">풍향: {weather.windDir}°</div>
              </div>
              {/* 바람 세기 Bar 그래프 */}
              <div className="w-full mb-2 flex flex-col items-center" style={{marginBottom: '0px'}}>
                {/* 풍속 값 텍스트 */}
                <div className="text-center text-base font-semibold mb-1 text-blue-700">풍속 {weather.windSpeed} m/s</div>
                <Bar
                  data={{
                    labels: ['풍속'],
                    datasets: [
                      {
                        label: '풍속(m/s)',
                        data: [weather.windSpeed],
                        backgroundColor: '#2563eb',
                        borderRadius: 6,
                        barThickness: 24
                      }
                    ]
                  }}
                  options={{
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        min: 0,
                        max: 10,
                        ticks: {
                          stepSize: 2,
                          color: '#64748b',
                          font: { size: 14 },
                          padding: 8
                        },
                        grid: { display: true, color: '#e5e7eb' }
                      },
                      y: { grid: { display: false }, ticks: { display: false } }
                    },
                    layout: { padding: { bottom: 24 } }
                  }}
                  height={60}
                />
                <div className="flex flex-row justify-center items-center gap-6 mt-2">
                  <div>온도: {weather.temp} ℃</div>
                  <div>습도: {weather.humidity} %</div>
                </div>
              </div>
            </div>
          )}
          {/* 악취지점 상세 정보 및 그래프 */}
          {selectedLocation && (
            <div className="absolute right-4 bottom-4 w-96 bg-white rounded shadow p-4 z-50" style={{right: '1rem'}}>
              <div className="mb-2">
                <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold mr-2 ${selectedLocation.type === '거점형' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedLocation.type}</span>
                <span className="font-bold">{selectedLocation.name}</span>
              </div>
              <div className="mb-2">등급: <span style={{ color: getLabelColor(selectedLocation.grade) }}>{selectedLocation.grade}</span></div>
              <div className="mb-2">암모니아(NH₃): {selectedLocation.nh3} ppm</div>
              <div className="mb-2">황화수소(H₂S): {selectedLocation.h2s} ppm</div>
              <div className="mb-2">이산화탄소(CO₂): {selectedLocation.co2} ppm</div>
              <div className="mb-2">실시간 추이</div>
              <Line
                data={{
                  labels: selectedLocation.labels,
                  datasets: [
                    {
                      label: '악취강도',
                      data: selectedLocation.timeSeries,
                      borderColor: getLabelColor(selectedLocation.grade),
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      fill: true,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } }
                }}
                height={120}
              />
            </div>
          )}
          {/* 등급 기준 범례 */}
          <div className="absolute bottom-8 right-8 bg-white p-2 rounded shadow text-sm z-20">
            <div className="font-bold mb-1">등급 기준</div>
            <div className="flex flex-col space-y-1">
              <span className="text-blue-600">■ 매우좋음</span>
              <span className="text-green-600">■ 좋음</span>
              <span className="text-yellow-500">■ 보통</span>
              <span className="text-orange-500">■ 경계</span>
              <span className="text-red-600">■ 나쁨</span>
            </div>
          </div>
        </div>
      );
    } else if (selectedTab === '시설 지도') {
      return (
        <div className="absolute inset-0">
          <Map
            center={mapCenter}
            style={{ width: '100%', height: '100%' }}
            level={4}
            ref={mapRef}
            mapTypeId={window.kakao?.maps?.MapTypeId?.[mapType.toUpperCase()]}
          >
            {pipeLocations.map((location) => (
              <MapMarker
                key={`pipe-${location.id}`}
                position={location.position}
                onClick={() => handlePipeMarkerClick(location)}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                  size: { width: 24, height: 35 }
                }}
              />
            ))}
          </Map>
          {/* 하수관로 시설 정보 */}
          {selectedPipeInfo && (
            <div className="absolute top-24 right-4 w-[900px] bg-white rounded shadow-lg p-6 border border-gray-200 max-h-[calc(100vh-8rem)] overflow-y-auto z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">하수관거대장 정보조회</h2>
                <button
                  onClick={() => setSelectedPipeInfo(null)}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ✕
                </button>
              </div>
              <table className="w-full text-sm border">
                <tbody>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">관용도</td>
                    <td className="p-2">{selectedPipeInfo.오수관}</td>
                    <td className="font-semibold bg-gray-50 p-2">관재질</td>
                    <td className="p-2">{selectedPipeInfo.관재질}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">규모</td>
                    <td className="p-2">지선</td>
                    <td className="font-semibold bg-gray-50 p-2">단면형태</td>
                    <td className="p-2">{selectedPipeInfo.단면형태}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">경 (mm)</td>
                    <td className="p-2">{selectedPipeInfo.구경}</td>
                    <td className="font-semibold bg-gray-50 p-2">연장 (m)</td>
                    <td className="p-2">{selectedPipeInfo.연장}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">세로길이 (m)</td>
                    <td className="p-2">{selectedPipeInfo.세로길이}</td>
                    <td className="font-semibold bg-gray-50 p-2">시점관저고(m)</td>
                    <td className="p-2">{selectedPipeInfo.기초깊이}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">종점관저고 (m)</td>
                    <td className="p-2">{selectedPipeInfo.중점깊이}</td>
                    <td className="font-semibold bg-gray-50 p-2">종점깊이 (m)</td>
                    <td className="p-2">{selectedPipeInfo.중점깊이}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">평균구배 (%)</td>
                    <td className="p-2">{selectedPipeInfo.평균구배}</td>
                    <td className="font-semibold bg-gray-50 p-2">시행부서</td>
                    <td className="p-2">{selectedPipeInfo.시공결과}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">노면재질</td>
                    <td className="p-2">{selectedPipeInfo.노면재질}</td>
                    <td className="font-semibold bg-gray-50 p-2">처리구역명</td>
                    <td className="p-2">{selectedPipeInfo.처리구명}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">처리분구명</td>
                    <td className="p-2">{selectedPipeInfo.처리구명2}</td>
                    <td className="font-semibold bg-gray-50 p-2">최종준설일</td>
                    <td className="p-2">{selectedPipeInfo.최종조성일}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">청천시유속 (m/sec)</td>
                    <td className="p-2">{selectedPipeInfo.청천시유속}</td>
                    <td className="font-semibold bg-gray-50 p-2">청천시유속 (m/sec)</td>
                    <td className="p-2">{selectedPipeInfo.청천시유속2}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">계획관경</td>
                    <td className="p-2">{selectedPipeInfo.계획연장}</td>
                    <td className="font-semibold bg-gray-50 p-2">처리장명</td>
                    <td className="p-2">{selectedPipeInfo.처리구명}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">배수구역명</td>
                    <td className="p-2">{selectedPipeInfo.배수구명}</td>
                    <td className="font-semibold bg-gray-50 p-2">관로번호</td>
                    <td className="p-2">{selectedPipeInfo.관련번호}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">차집관명칭</td>
                    <td className="p-2">{selectedPipeInfo.사전관로명}</td>
                    <td className="font-semibold bg-gray-50 p-2">종점</td>
                    <td className="p-2">{selectedPipeInfo.탐사종류}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold bg-gray-50 p-2">성과심사고시번호</td>
                    <td className="p-2">{selectedPipeInfo.성과심사고시번호}</td>
                    <td className="font-semibold bg-gray-50 p-2" colSpan={2}>맨홀: 시점관리번호 {selectedPipeInfo.시점관로번호} / 종점관리번호 {selectedPipeInfo.종점관로번호}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow">유지보수이력</button>
              </div>
            </div>
          )}
        </div>
      );
    } else if (selectedTab === '민원 지도') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg border border-gray-200">
          <span className="text-gray-400">민원 지도 표시 영역</span>
        </div>
      );
    } else if (selectedTab === '체감 지도') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg border border-gray-200">
          <span className="text-gray-400">체감 지도 표시 영역</span>
        </div>
      );
    }
    return null;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-lg text-gray-600">지도를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full box-border overflow-hidden">
      {/* 상단 플로팅 바: 지도 컨트롤 + 메뉴바 + 현황목록 */}
      <div className="absolute top-0 left-0 w-full flex flex-row items-start justify-between z-30 pointer-events-none">
        {/* 지도 컨트롤 (일반/하이브리드) */}
        <div className="pointer-events-auto">
          <div className="bg-white/90 rounded-full px-4 py-2 flex space-x-2 absolute left-4 top-4 z-50 shadow-md shadow-gray-300/40">
            <button
              onClick={() => handleMapTypeChange('normal')}
              className={`px-4 py-2 rounded-full font-semibold text-sm focus:outline-none transition-colors duration-200 ${mapType === 'normal' ? 'bg-teal-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-teal-100'}`}
            >
              일반
            </button>
            <button
              onClick={() => handleMapTypeChange('hybrid')}
              className={`px-4 py-2 rounded-full font-semibold text-sm focus:outline-none transition-colors duration-200 ${mapType === 'hybrid' ? 'bg-teal-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-teal-100'}`}
            >
              하이브리드
            </button>
          </div>
        </div>
        {/* 지도유형 메뉴바 */}
        <div className="pointer-events-auto">
          <div className="bg-white/90 rounded-full px-4 py-2 space-x-2 flex absolute left-1/2 -translate-x-1/2 top-4 z-50 shadow-md shadow-gray-300/40">
            {tabMenu.map((tab) => (
              <button
                key={tab.label}
                className={`px-4 py-2 rounded-full font-semibold focus:outline-none transition-colors duration-200 text-sm ${selectedTab === tab.label ? 'bg-teal-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-teal-100'}`}
                onClick={() => setSelectedTab(tab.label)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* 악취 발생 현황 목록 */}
        {selectedTab === '악취 등급 지도' && showOdorList && (
          <div className="pointer-events-auto">
            <div className="w-96 bg-white rounded p-4 bg-white/95 max-h-[calc(100vh-28rem)] mb-4 right-4 absolute top-4 z-40 shadow-md shadow-gray-300/40" style={{right: '1rem', top: '1rem'}}>
              <h3 className="text-lg font-semibold mb-4">악취 발생 현황</h3>
              <div className="space-y-4 overflow-y-auto">
                {pagedOdorLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`p-4 rounded cursor-pointer ${selectedLocation?.id === location.id ? 'bg-teal-50 border-2 border-teal-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold mr-2 ${location.type === '거점형' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{location.type}</span>
                        <h4 className="font-medium inline">{location.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">악취 강도: {location.grade}</p>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <button
                          onClick={e => { e.stopPropagation(); setShowComplaints(true); }}
                          className="px-3 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600"
                        >
                          주변 민원현황
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* 페이지네이션 */}
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    className={`w-8 h-8 rounded-full font-semibold text-sm focus:outline-none transition-colors duration-200 ${currentPage === idx + 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-teal-100'}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 지도 및 플로팅 UI */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OdorMap;