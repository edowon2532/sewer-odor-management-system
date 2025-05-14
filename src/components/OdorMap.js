import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Map, MapMarker, Roadview, Circle, Polyline } from 'react-kakao-maps-sdk';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { FiSettings, FiLayers } from 'react-icons/fi';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 등급 산정 함수 (value 기준)
function getOdorGrade(value) {
  if (value <= 0.005) return '매우좋음';
  if (value <= 0.01) return '좋음';
  if (value <= 0.1) return '보통';
  if (value <= 2.0) return '나쁨';
  return '매우나쁨';
}

// 등급별 색상 정의
const gradeColors = {
  '매우좋음': '#2563eb',  // 파란색
  '좋음': '#8BC34A',      // 연한 녹색
  '보통': '#FFC107',      // 노란색
  '나쁨': '#FF9800',      // 주황색
  '매우나쁨': '#F44336'   // 빨간색
};

// 등급별 숫자 매핑
const gradeNumberMap = {
  '매우좋음': 1,
  '좋음': 2,
  '보통': 3,
  '나쁨': 4,
  '매우나쁨': 5
};

// 악취 발생 지점 데이터 (광주 남구 시가지 도로 위 좌표로 수정)
const baseOdorLocations = [
  { id: 1, type: '지점형', markerLabel: 'P0', name: '광수비어 주월점 앞 공영주차장', position: { lat: 35.1317333794544, lng: 126.908264760075 } },
  { id: 2, type: '지점형', markerLabel: 'P0', name: 'SK t월드', position: { lat: 35.150441252113, lng: 126.896320258897 } },
  { id: 3, type: '지점형', markerLabel: 'P0', name: 'GS25 백운사랑점', position: { lat: 35.1362137859377, lng: 126.897789635858 } },
  { id: 4, type: '지점형', markerLabel: 'P0', name: '월산 새마을금고 본점', position: { lat: 35.1445697685181, lng: 126.89176398337 } },
  { id: 5, type: '지점형', markerLabel: 'P0', name: '이진실내건축 앞 골목', position: { lat: 35.1434475189793, lng: 126.907830894437 } },
  { id: 6, type: '지점형', markerLabel: 'P0', name: '해태자이아파트 정문', position: { lat: 35.1345173777814, lng: 126.891618848347 } },
  { id: 7, type: '지점형', markerLabel: 'P0', name: '영무예다음 앞', position: { lat: 35.14182656019, lng: 126.909451939605 } },
  { id: 8, type: '지점형', markerLabel: 'P0', name: '광주문화재단 앞', position: { lat: 35.148137278274, lng: 126.908513026552 } },
  { id: 9, type: '지점형', markerLabel: 'P0', name: 'kbc건물 앞 골목', position: { lat: 35.1440686251486, lng: 126.907801772651 } },
  { id: 10, type: '지점형', markerLabel: 'P0', name: '월산근린공원화장실', position: { lat: 35.1406144149879, lng: 126.896829583556 } },
  { id: 11, type: '지점형', markerLabel: 'P0', name: 'CU 골목', position: { lat: 35.137705571865, lng: 126.914214937827 } },
  { id: 12, type: '지점형', markerLabel: 'P0', name: '409한식뷔페 앞 전기차충전소', position: { lat: 35.1328081427305, lng: 126.902464374511 } },
  { id: 13, type: '지점형', markerLabel: 'P0', name: '벌크커피 대성사거리점', position: { lat: 35.1438605855569, lng: 126.9031722634 } },
  { id: 14, type: '지점형', markerLabel: 'P0', name: '월산5동 행정복지센터', position: { lat: 35.139876921496, lng: 126.893804703369 } },
  { id: 15, type: '지점형', markerLabel: 'P0', name: '서광경로당', position: { lat: 35.1378667092919, lng: 126.903286564833 } },
  { id: 16, type: '지점형', markerLabel: 'P0', name: '광주서광중학교 정문', position: { lat: 35.1353029178761, lng: 126.90632697898 } },
  { id: 17, type: '지점형', markerLabel: 'P0', name: '기독간호대학 앞', position: { lat: 35.1378473646882, lng: 126.916944370728 } },
  { id: 18, type: '지점형', markerLabel: 'P0', name: '행정복지센터 앞', position: { lat: 35.1407303115114, lng: 126.916462464974 } },
  { id: 19, type: '지점형', markerLabel: 'P0', name: '주월양우내안애 아파트 정문', position: { lat: 35.1336648210164, lng: 126.900167641848 } },
  { id: 20, type: '지점형', markerLabel: 'P0', name: '까치고개 버스승강장', position: { lat: 35.140660949157, lng: 126.90218441096 } },
  { id: 21, type: '지점형', markerLabel: 'P0', name: '현대아트', position: { lat: 35.136363016259, lng: 126.900674023161 } },
  { id: 22, type: '지점형', markerLabel: 'P0', name: '우영타워아파트 입구', position: { lat: 35.15097120322, lng: 126.899906715378 } },
  { id: 23, type: '지점형', markerLabel: 'P0', name: '대흥백운스카이차 아파트 입구', position: { lat: 35.1410250226146, lng: 126.907599238154 } },
  { id: 24, type: '지점형', markerLabel: 'P0', name: '파리바게뜨 광주백운점', position: { lat: 35.1390860099213, lng: 126.905955820919 } },
  { id: 25, type: '지점형', markerLabel: 'P0', name: '광주공원노인복지관 앞', position: { lat: 35.1474706271701, lng: 126.907912175645 } },
  { id: 26, type: '지점형', markerLabel: 'P0', name: '영암돌담', position: { lat: 35.1420180918345, lng: 126.905429460607 } },
  { id: 27, type: '지점형', markerLabel: 'P0', name: '반도유보라 아파트 정문', position: { lat: 35.151604634492, lng: 126.898337121134 } },
  { id: 28, type: '지점형', markerLabel: 'P0', name: '빙그레 제일대리점 앞', position: { lat: 35.1330438892338, lng: 126.91691227278 } },
  { id: 29, type: '지점형', markerLabel: 'P0', name: '호호만두 삼거리', position: { lat: 35.1399735999907, lng: 126.907148885862 } },
  { id: 30, type: '지점형', markerLabel: 'P0', name: '신촌경로당', position: { lat: 35.1444857157769, lng: 126.895198185521 } },
  { id: 31, type: '지점형', markerLabel: 'P0', name: '와이마트(동신점)', position: { lat: 35.1499064668743, lng: 126.89641630449 } },
  { id: 32, type: '지점형', markerLabel: 'P0', name: '현대화관 앞 봉선공원', position: { lat: 35.130343174789, lng: 126.911742387157 } },
  { id: 33, type: '지점형', markerLabel: 'P0', name: '대성사거리 버스승강장', position: { lat: 35.143071193667, lng: 126.902972713325 } },
  { id: 34, type: '지점형', markerLabel: 'P0', name: '공영1주차장', position: { lat: 35.1420816932742, lng: 126.915121571158 } },
  { id: 35, type: '지점형', markerLabel: 'P0', name: '제활용품무인회수기 근처', position: { lat: 35.13510024326, lng: 126.894219298151 } },
  { id: 36, type: '지점형', markerLabel: 'P0', name: '방범용CCTV', position: { lat: 35.1471019859156, lng: 126.899536581566 } },
  { id: 37, type: '지점형', markerLabel: 'P0', name: '백운휴먼시아3단지 305동 출입구', position: { lat: 35.140931911674, lng: 126.906074731904 } },
  { id: 38, type: '지점형', markerLabel: 'P0', name: '자율방범초소 옆', position: { lat: 35.1438532678065, lng: 126.90932547439 } },
  { id: 39, type: '지점형', markerLabel: 'P0', name: '월산 제2어린이공원', position: { lat: 35.1392273058583, lng: 126.894006132255 } },
  { id: 40, type: '지점형', markerLabel: 'P0', name: '골목 삼거리', position: { lat: 35.1469368648821, lng: 126.906064321334 } },
  { id: 41, type: '지점형', markerLabel: 'P0', name: '수피아여고 버스승강장', position: { lat: 35.135133967925, lng: 126.910699119954 } },
  { id: 42, type: '지점형', markerLabel: 'P0', name: '월스테이트 백운아파트 정문', position: { lat: 35.1364971018167, lng: 126.898453890235 } },
  { id: 43, type: '지점형', markerLabel: 'P0', name: '반도유보라 아파트 후문', position: { lat: 35.1497487673006, lng: 126.897096255375 } },
  { id: 44, type: '구역형', markerLabel: 'A', name: '금호평생교육관', position: { lat: 35.1455665693473, lng: 126.900693459383 } },
  { id: 45, type: '구역형', markerLabel: 'A', name: 'GS25 백운사랑점', position: { lat: 35.1362137859377, lng: 126.897789635858 } },
  { id: 46, type: '구역형', markerLabel: 'A', name: '월산운혜교회', position: { lat: 35.1509578951738, lng: 126.898106802383 } },
  { id: 47, type: '구역형', markerLabel: 'A', name: '대성초병설유치원앞 골목', position: { lat: 35.1441880186076, lng: 126.904039009571 } },
  { id: 48, type: '구역형', markerLabel: 'A', name: '해태1차아파트 정문(인도없음)', position: { lat: 35.1345173777814, lng: 126.891618848347 } },
  { id: 49, type: '구역형', markerLabel: 'A', name: '영무예다음 앞', position: { lat: 35.14182656019, lng: 126.909451939605 } },
  { id: 50, type: '구역형', markerLabel: 'A', name: '409한식뷔페 앞 전기차충전소', position: { lat: 35.1328081427305, lng: 126.902464374511 } },
  { id: 51, type: '구역형', markerLabel: 'A', name: '백운초교 남 버스승강장', position: { lat: 35.1362073875037, lng: 126.900608706175 } },
  { id: 52, type: '구역형', markerLabel: 'A', name: '방림사거리 정류장 앞', position: { lat: 35.133402147877, lng: 126.918054878246 } },
  { id: 53, type: '구역형', markerLabel: 'A', name: '현대화관 앞 봉선공원', position: { lat: 35.130343174789, lng: 126.911742387157 } },
  { id: 54, type: '구역형', markerLabel: 'A', name: '남구 장애인복지관', position: { lat: 35.1420884573625, lng: 126.899892571539 } },
  { id: 55, type: '구역형', markerLabel: 'A', name: '백운휴먼시아3단지 305동 출입구', position: { lat: 35.140931911674, lng: 126.906074731904 } },
  { id: 56, type: '구역형', markerLabel: 'A', name: 'GS백운주공점', position: { lat: 35.140774556511, lng: 126.902788895227 } },
  { id: 57, type: '구역형', markerLabel: 'A', name: '행정복지센터 옆골목', position: { lat: 35.1405942185463, lng: 126.916480929124 } },
  { id: 58, type: '구역형', markerLabel: 'A', name: 'CU 골목', position: { lat: 35.137705571865, lng: 126.914214937827 } },
  { id: 59, type: '구역형', markerLabel: 'A', name: '기독간호대학 앞', position: { lat: 35.1378473646882, lng: 126.916944370728 } },
  { id: 60, type: '구역형', markerLabel: 'A', name: '와이마트(동신점)', position: { lat: 35.1499064668743, lng: 126.89641630449 } },
  { id: 61, type: '구역형', markerLabel: 'A', name: '월산4동 작은도서관', position: { lat: 35.1466012377438, lng: 126.890738743578 } },
  { id: 62, type: '구역형', markerLabel: 'A', name: '주차장 앞', position: { lat: 35.1429213620229, lng: 126.913535038524 } },
  { id: 63, type: '구역형', markerLabel: 'A', name: '월산 제2어린이공원', position: { lat: 35.1392273058583, lng: 126.894006132255 } },
  { id: 64, type: '구역형', markerLabel: 'A', name: '수피아여고(기독교병원 방면) 버스승강장', position: { lat: 35.135133967925, lng: 126.910699119954 } },
  { id: 65, type: '구역형', markerLabel: 'A', name: '월산 새마을금고 본점', position: { lat: 35.1445697685181, lng: 126.89176398337 } },
  { id: 66, type: '구역형', markerLabel: 'A', name: '덴마크우유 앞', position: { lat: 35.1294901321472, lng: 126.9242791634 } },
  { id: 67, type: '구역형', markerLabel: 'A', name: '미스터피자 앞', position: { lat: 35.1339480161708, lng: 126.906829961585 } },
  { id: 68, type: '구역형', markerLabel: 'A', name: '공용주차장 일대', position: { lat: 35.1244171212243, lng: 126.895593729079 } },
  { id: 69, type: '구역형', markerLabel: 'A', name: '방림2어린이공원 앞', position: { lat: 35.1307955688697, lng: 126.914636261235 } },
  { id: 70, type: '구역형', markerLabel: 'A', name: '봉선로 남해오네뜨 아파트 정문', position: { lat: 35.1293040416118, lng: 126.903301297505 } },
  { id: 71, type: '구역형', markerLabel: 'A', name: '봉선1어린이공원', position: { lat: 35.1302295195123, lng: 126.908470191639 } },
  { id: 72, type: '구역형', markerLabel: 'A', name: '금강한의원', position: { lat: 35.1425912208001, lng: 126.892711081923 } },
  { id: 73, type: '구역형', markerLabel: 'A', name: '고릴라캠핑샵 건너편', position: { lat: 35.1091059334699, lng: 126.897009052187 } },
  { id: 74, type: '구역형', markerLabel: 'A', name: '금호아파트 입구', position: { lat: 35.1093821580381, lng: 126.896745011531 } },
  { id: 75, type: '구역형', markerLabel: 'A', name: '진아리채아파트 입구', position: { lat: 35.1042356458975, lng: 126.883540692973 } }
];

// 등급별 value 범위
const gradeValueRange = {
  '매우좋음': [0, 0.005],
  '좋음': [0.00501, 0.01],
  '보통': [0.01001, 0.1],
  '나쁨': [0.10001, 2.0],
  '매우나쁨': [2.0001, 3.0],
};

// 거리 기반 등급 분포 함수
function assignGradesByDistance(baseOdorLocations) {
  // 1. 5등급(매우나쁨) 지점 1개 선정
  const centerIdx = Math.floor(Math.random() * baseOdorLocations.length);
  const center = baseOdorLocations[centerIdx];

  // 2. 나머지 지점들과의 거리 계산
  const withDistance = baseOdorLocations.map((loc, idx) => {
    if (idx === centerIdx) return { ...loc, distance: 0, idx };
    const dx = loc.position.lat - center.position.lat;
    const dy = loc.position.lng - center.position.lng;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return { ...loc, distance: dist, idx };
  });

  // 3. 거리순 정렬(자기 자신(5등급)은 맨 앞)
  withDistance.sort((a, b) => a.distance - b.distance);

  // 4. 등급 분포 계산
  const n = withDistance.length;
  const n5 = 1; // 5등급 1개
  const n4 = Math.floor(n * 0.2);
  const n3 = Math.floor(n * 0.2);
  const n2 = Math.floor(n * 0.3);
  const n1 = n - (n5 + n4 + n3 + n2);

  // 5. 등급 할당
  withDistance[0].grade = '매우나쁨';
  for (let i = 1; i <= n4; i++) withDistance[i].grade = '나쁨';
  for (let i = n4 + 1; i <= n4 + n3; i++) withDistance[i].grade = '보통';
  for (let i = n4 + n3 + 1; i <= n4 + n3 + n2; i++) withDistance[i].grade = '좋음';
  for (let i = n4 + n3 + n2 + 1; i < n; i++) withDistance[i].grade = '매우좋음';

  // 6. 원래 순서대로 복원
  withDistance.sort((a, b) => a.idx - b.idx);

  return withDistance.map(loc => loc.grade);
}

const gradeDist = assignGradesByDistance(baseOdorLocations);

const getRandomValueByGrade = (grade) => {
  const [min, max] = gradeValueRange[grade] || [0.01, 0.1]; // 방어 코드
  return Number((Math.random() * (max - min) + min).toFixed(3));
};

// 로딩 시마다 랜덤값 생성
const getRandomOdorValue = () => Number((Math.random() * 3).toFixed(3)); // 0~3 ppm
const getRandomTemp = () => Number((Math.random() * 10 + 20).toFixed(1)); // 20~30도
const getRandomHumidity = () => Number((Math.random() * 40 + 40).toFixed(1)); // 40~80%

const getRandomTimeSeries = (base) => {
  // base값을 중심으로 약간의 변동, 0 미만으로 내려가지 않게 보정
  return Array.from({length: 6}, () => Math.max(0, Number((base + (Math.random() - 0.5) * 0.2).toFixed(3))));
};

const getRandomNH3 = () => Number((Math.random() * 1.5).toFixed(3));
const getRandomCO2 = () => Number((Math.random() * 1).toFixed(3));

const KAKAO_REST_API_KEY = 'f451ee0f4eaf57c2a72f29c6112214e9';

const gsLocation = baseOdorLocations.find(loc => loc.name.includes('GS백운주공점'));
const initialMapCenter = gsLocation ? gsLocation.position : { lat: 35.1264, lng: 126.9117 };

const OdorMap = () => {
  // odorLocations를 useState로 관리
  const [odorLocations, setOdorLocations] = useState(() =>
    baseOdorLocations.map((loc, idx) => {
      const grade = gradeDist[idx];
      const value = getRandomValueByGrade(grade);
      const temp = getRandomTemp();
      const humidity = getRandomHumidity();
      return {
        ...loc,
        value,
        nh3: getRandomNH3(),
        h2s: value,
        co2: getRandomCO2(),
        temp,
        humidity,
        timeSeries: getRandomTimeSeries(value),
        labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
        grade
      };
    })
  );

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState(initialMapCenter);
  const [showRoadview, setShowRoadview] = useState(false);
  const [roadviewPosition, setRoadviewPosition] = useState(null);
  const [roadviewError, setRoadviewError] = useState(false);
  const [mapType, setMapType] = useState('hybrid');
  const [selectedTab, setSelectedTab] = useState('악취 등급 지도');
  const [selectedPipeInfo, setSelectedPipeInfo] = useState(null);
  const mapRef = useRef(null);
  const roadviewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPipeModal, setShowPipeModal] = useState(false);
  const [showOdor, setShowOdor] = useState(true);
  const [showPipe, setShowPipe] = useState(false);
  const [showWeather, setShowWeather] = useState(false); // 기본 off
  const [showComplaints, setShowComplaints] = useState(false);
  const [showOdorList, setShowOdorList] = useState(false); // 기본 off
  const [showComplaintLayer, setShowComplaintLayer] = useState(false);
  const [showComplaintCircle, setShowComplaintCircle] = useState(true);
  const [windData, setWindData] = useState(null);
  const [showFacilityPin, setShowFacilityPin] = useState(true);
  const [showFacilityInfo, setShowFacilityInfo] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResults, setBulkResults] = useState([]); // [{name, address, lat, lng, type, status}]
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showLayerControl, setShowLayerControl] = useState(false); // 레이어 관리 모달 상태
  const [showTabMenu, setShowTabMenu] = useState(false); // 지도유형 선택 모달 상태
  // 상태 추가
  const [areaDetailPage, setAreaDetailPage] = useState(0);

  // 기존 customOdorLocations 및 단일 등록 기능 제거
  const allOdorLocations = odorLocations;

  // 구역형 마커별 windData를 미리 생성 (useMemo)
  const areaWindDataMap = useMemo(() => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const map = {};
    odorLocations.forEach(loc => {
      if (loc.type === '구역형') {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        map[loc.id] = generateWindFieldData(dir);
      }
    });
    return map;
  }, []);

  // 백지도(그레이스케일) 스타일 정의
  const grayscaleStyle = [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        { saturation: -100 },
        { lightness: 0 },
        { gamma: 1 }
      ]
    }
  ];

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

  // 백지도(그레이스케일) 필터 적용: 배경지도 타일에만 적용
  useEffect(() => {
    if (!isLoaded) return;
    const mapRoot = document.querySelector('.map_wrap, .wrap_map, .root_daum_roughmap, .mapContainer, .map-root, .map') || document.getElementById('map');
    if (!mapRoot) return;

    // 실제 타일 클래스명 확인
    const applyGrayscale = () => {
      const tiles = mapRoot.querySelectorAll('.bg_tile, .tile, .tileimg, .tileimage');
      tiles.forEach(tile => {
        tile.style.filter = mapType === 'blank' ? 'grayscale(1)' : '';
      });
    };

    applyGrayscale();

    // MutationObserver로 타일 변화 감지
    const observer = new MutationObserver(applyGrayscale);
    observer.observe(mapRoot, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isLoaded, mapType]);

  // 광주 남구 중심 좌표
  const center = {
    lat: 35.1264,
    lng: 126.9117
  };

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
  const itemsPerPage = 3;
  const totalPages = Math.ceil(allOdorLocations.length / itemsPerPage);
  const pagedOdorLocations = allOdorLocations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 한글 풍향 매핑
  const directionKorMap = {
    'N': '북',
    'NE': '북동',
    'E': '동',
    'SE': '남동',
    'S': '남',
    'SW': '남서',
    'W': '서',
    'NW': '북서'
  };

  // 등급별 텍스트 색상 반환 함수 복구
  const getLabelColor = (grade) => {
    switch (grade) {
      case '매우좋음': return '#2563eb';
      case '좋음': return '#16a34a';
      case '보통': return '#eab308';
      case '나쁨': return '#FF9800'; // 주황색
      case '매우나쁨': return '#dc2626';
      default: return '#6d28d9';
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    console.log('선택된 위치:', location); // 이 로그가 뜨는지 확인
    setShowComplaints(false);
    setMapCenter(location.position);
    if (mapRef.current) {
      mapRef.current.setLevel(3);
    }
    // 구역형 지점 선택 시 windData 동기화
    if (location.type === '구역형') {
      // 8방위 중 하나를 랜덤 선택
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const dirIndex = Math.floor(Math.random() * directions.length);
      const randomDirection = directions[dirIndex];
      const newWindData = generateWindFieldData(randomDirection);
      setWindData({
        direction: randomDirection,
        ...newWindData
      });
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
    { label: '분석 지도' }
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

  // 샘플 기상 데이터 (랜덤)
  const [weather, setWeather] = useState({
    windDir: 45,
    windSpeed: 2.3,
    temp: 23.5,
    humidity: 62
  });

  useEffect(() => {
    if (!isLoaded) return;
    // 4방위 각도 배열 (북동=45, 남동=135, 남서=225, 북서=315)
    const windAngles = [45, 135, 225, 315];
    const windDir = windAngles[Math.floor(Math.random() * windAngles.length)];
    const windSpeed = (Math.random() * 8 + 1).toFixed(1); // 1~9 m/s
    const temp = (Math.random() * 15 + 15).toFixed(1); // 15~30도
    const humidity = (Math.random() * 40 + 40).toFixed(1); // 40~80%
    setWeather({
      windDir,
      windSpeed: Number(windSpeed),
      temp: Number(temp),
      humidity: Number(humidity)
    });
  }, [isLoaded]);

  // 악취측정지점 주변 70개 랜덤 민원발생지점 생성
  function generateRandomComplaintPoints() {
    const points = [];
    const R = 0.002; // 약 200m 반경
    const grade5Locations = odorLocations.filter(loc => loc.grade === '매우나쁨');
    const grade4Locations = odorLocations.filter(loc => loc.grade === '나쁨');
    const otherLocations = odorLocations.filter(loc => loc.grade !== '매우나쁨' && loc.grade !== '나쁨');

    const total = 70;
    const count5 = Math.floor(total * 0.4); // 40%
    const count4 = Math.floor(total * 0.3); // 30%
    const countOther = total - count5 - count4; // 나머지 30%

    // 5등급(매우나쁨) 지역 주변
    for (let i = 0; i < count5; i++) {
      const base = grade5Locations.length > 0
        ? grade5Locations[Math.floor(Math.random() * grade5Locations.length)].position
        : odorLocations[Math.floor(Math.random() * odorLocations.length)].position;
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * R;
      const lat = base.lat + r * Math.cos(theta);
      const lng = base.lng + r * Math.sin(theta);
      points.push({ id: i + 1, position: { lat, lng } });
    }
    // 4등급(나쁨) 지역 주변
    for (let i = 0; i < count4; i++) {
      const base = grade4Locations.length > 0
        ? grade4Locations[Math.floor(Math.random() * grade4Locations.length)].position
        : odorLocations[Math.floor(Math.random() * odorLocations.length)].position;
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * R;
      const lat = base.lat + r * Math.cos(theta);
      const lng = base.lng + r * Math.sin(theta);
      points.push({ id: count5 + i + 1, position: { lat, lng } });
    }
    // 나머지 지역 주변
    for (let i = 0; i < countOther; i++) {
      const base = otherLocations.length > 0
        ? otherLocations[Math.floor(Math.random() * otherLocations.length)].position
        : odorLocations[Math.floor(Math.random() * odorLocations.length)].position;
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * R;
      const lat = base.lat + r * Math.cos(theta);
      const lng = base.lng + r * Math.sin(theta);
      points.push({ id: count5 + count4 + i + 1, position: { lat, lng } });
    }
    return points;
  }
  const randomComplaintPoints = useMemo(
    () => generateRandomComplaintPoints(),
    [odorLocations.map(loc => loc.grade).join(',')]
  );

  // 마커 스타일 정의
  const markerStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };

  // 측정지점 명칭을 '읍면동명-일련번호 악취 측정지점' 형식으로 반환하는 함수
  function getDisplayName(location) {
    const idx = odorLocations.findIndex(loc => loc.id === location.id);
    if (idx < 0) return location.name;
    // 읍면동명 추출 (예: '봉선동 악취 측정지점' → '봉선동')
    const match = location.name.match(/^([가-힣]+)[\s-]*악취 측정지점/);
    const dong = match ? match[1] : location.name;
    return `${dong}-${idx + 1} 악취 측정지점`;
  }

  // 정보창 컴포넌트
  const InfoWindow = ({ location, onClose }) => {
    const grade = getOdorGrade(location.value);
    const color = gradeColors[grade];

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center w-full justify-between">
            <h3 className="text-lg font-semibold">{getDisplayName(location)}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">황화수소(H₂S):</span>
            <span className="text-sm">{location.h2s.toFixed(3)} ppm</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">악취 등급:</span>
            <span className="text-sm" style={{ color }}>{grade}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">악취 농도:</span>
            <span className="text-sm">{location.value.toFixed(3)} ppm</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">온도:</span>
            <span className="text-sm">{location.temp}°C</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">습도:</span>
            <span className="text-sm">{location.humidity}%</span>
          </div>
          <div className="flex justify-end mt-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
              </svg>
              소비전력 관리
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 바람장 데이터 생성 함수
  function generateWindFieldData(windDirection) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionsKor = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    const baseSpeed = (Math.random() * 2 + 2).toFixed(1); // 2.0 ~ 4.0 m/s
    const pressure = (Math.random() * 10 + 1008).toFixed(1); // 1008.0 ~ 1018.0 hPa
    
    // 주 풍향 인덱스 찾기
    const mainDirectionIndex = directions.indexOf(windDirection);
    
    // 각 방향별 풍속 계산
    const data = directions.map((_, index) => {
      const distance = Math.min(
        Math.abs(index - mainDirectionIndex),
        8 - Math.abs(index - mainDirectionIndex)
      );
      const ratio = Math.max(0.2, 1 - (distance * 0.2)); // 거리에 따른 감소율
      return (baseSpeed * ratio).toFixed(1);
    });

    return {
      data: data,
      baseSpeed: baseSpeed,
      pressure: pressure,
      directionKor: directionsKor[mainDirectionIndex],
      labelsKor: directionsKor,
      direction: windDirection // direction 값도 포함
    };
  }

  // 저감시설 동작 상태 뱃지 분포: 대기 70%, 저감 30%, 오류는 전체 지점형 중 1개만
  let errorAssigned = false;
  function getFacilityStatusByIndex(idx, isErrorTarget, grade) {
    if (grade === '나쁨' || grade === '매우나쁨') {
      return { text: '가동', color: 'bg-green-500' };
    }
    if (isErrorTarget) {
      return { text: '점검', color: 'bg-red-500' };
    }
    const rand = Math.random();
    if (rand < 0.7) {
      return { text: '대기', color: 'bg-gray-400' };
    } else {
      return { text: '가동', color: 'bg-green-500' };
    }
  }

  // 탭별로 보여줄 내용 정의
  const renderTabContent = () => {
    if (selectedTab === '악취 등급 지도') {
      return (
        <div className="absolute inset-0">
          {/* 레이어 콘트롤 */}
          <div className="absolute left-4 top-24 bg-white rounded shadow p-2 z-40 min-w-[180px] hidden md:block">
            <div className="font-bold text-base mb-2 flex items-center justify-between">
              <span>레이어 관리</span>
              <button className="ml-2 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded font-semibold" title="설정">설정</button>
            </div>
            <button className="w-full mb-2 px-2 py-1 bg-blue-500 text-white rounded text-sm font-semibold hover:bg-blue-600" onClick={() => setShowAddModal(true)}>지점 추가</button>
            <label className="block"><input type="checkbox" checked={showOdor} onChange={e => setShowOdor(e.target.checked)} /> 악취측정지점</label>
            {showOdor && (
              <div className="ml-6 mt-1 space-y-1 text-sm">
                <label className="block"><input type="checkbox" checked={showFacilityPin} onChange={e => setShowFacilityPin(e.target.checked)} /> 측정시설</label>
                <label className="block"><input type="checkbox" checked={showFacilityInfo} onChange={e => setShowFacilityInfo(e.target.checked)} /> 측정정보</label>
              </div>
            )}
            <label className="block"><input type="checkbox" checked={showOdorList} onChange={e => setShowOdorList(e.target.checked)} /> 악취 발생 현황</label>
            <label className="block"><input type="checkbox" checked={showComplaintLayer} onChange={e => setShowComplaintLayer(e.target.checked)} /> 민원발생지점</label>
            <label className="block"><input type="checkbox" checked={showComplaintCircle} onChange={e => setShowComplaintCircle(e.target.checked)} /> 악취영향권</label>
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
            {/* 민원발생지점 마커 */}
            {showComplaintLayer && randomComplaintPoints.map((p) => (
              <MapMarker
                key={`complaint-layer-${p.id}`}
                position={p.position}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                  size: { width: 24, height: 35 }
                }}
                zIndex={1}
              />
            ))}
            {/* 악취측정지점 마커 - allOdorLocations 사용 */}
            {showOdor && allOdorLocations.map((location, idx) => {
              const grade = getOdorGrade(location.value);
              const color = gradeColors[grade];
              // 구역형 마커는 areaWindDataMap에서 windData를 가져오되, 선택된 마커는 상세정보 모달의 windData를 사용
              const isSelectedArea = location.type === '구역형' && selectedLocation?.id === location.id && windData;
              const windDataForArea = location.type === '구역형'
                ? (isSelectedArea ? windData : areaWindDataMap[location.id])
                : null;
              // 지점형 저감시설 상태: 첫 번째 지점형만 오류, 나머지는 대기/저감 랜덤
              let isErrorTarget = false;
              if (location.type === '지점형' && !errorAssigned) {
                isErrorTarget = true;
                errorAssigned = true;
              }
              // facilityStatus를 한 번만 계산해서 마커와 라벨에 모두 사용
              const facilityStatus = location.type === '지점형' ? getFacilityStatusByIndex(idx, isErrorTarget, location.grade) : null;
              // 마커 아이콘: 지점형=원형, 구역형=사각형
              const gradeNum = gradeNumberMap[grade];
              let svgString;
              if (location.type === '지점형') {
                // 모든 등급에 인디케이터 표시, 4,5등급만 상태 색상, 나머지는 회색
                let indicatorColor = '#d1d5db'; // 기본 회색
                let strokeColor = '#e5e7eb'; // 기본 gray-200 외곽선
                if ((location.grade === '나쁨' || location.grade === '매우나쁨') && facilityStatus) {
                  // 저감시설이 가동 중이면 외곽선 색상을 밝은 연두색으로 변경
                  if (facilityStatus.text === '가동') {
                    strokeColor = '#4CAF50';
                  }
                }
                svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <circle cx="16" cy="16" r="13" fill="${color}" stroke="${strokeColor}" stroke-width="3"/>
                  <text x="16" y="23" text-anchor="middle" font-size="16" font-weight="bold" fill="white">${gradeNum}</text>
                </svg>`;
              } else {
                // 구역형: 인디케이터 없는 사각형 마커만 표시, 외곽선도 gray-200
                svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect x="3" y="3" width="26" height="26" rx="5" fill="${color}" stroke="#e5e7eb" stroke-width="3"/><text x="16" y="23" text-anchor="middle" font-size="16" font-weight="bold" fill="white">${gradeNum}</text></svg>`;
              }
              const encodedSvg = encodeURIComponent(svgString);
              const markerImageUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
              
              // 측정시설(핀)만 on/off: MapMarker 자체를 showFacilityPin으로 감싼다
              if (!showFacilityPin) return null;
              return (
              <MapMarker
                key={location.id}
                position={location.position}
                  zIndex={9999}
                onClick={() => handleLocationClick(location)}
                  image={{
                    src: markerImageUrl,
                    size: { width: 32, height: 32 }
                  }}
                >
                  {/* 라벨 컨테이너(사각형 하얀 박스)만 showFacilityInfo로 on/off */}
                  {showFacilityInfo && (
                    <div className="flex flex-row items-center bg-white border-2 border-white shadow-sm px-2 py-2 min-w-[226px]" style={{pointerEvents: 'none', zIndex: 2147483647, height: '120%', borderRadius: '0', marginTop: '-2px', marginLeft: '-2px'}}>
                      <div className="flex flex-row flex-1 ml-2 justify-center items-center">
                        <div className="flex flex-col flex-1 justify-center">
                          <div className="flex items-center text-sm font-semibold" style={{color: color}}>
                            <span className="mr-1 text-xs text-black">H₂S</span>
                            <span className="text-lg text-black">{location.value.toFixed(3)}</span><span className="text-xs text-black"> ppm</span>
                          </div>
                          <div className="flex items-center text-[11px] text-gray-600 mt-0.5 whitespace-nowrap">
                            <span>{location.temp.toFixed(1)} ℃</span>
                            <span className="mx-1">/</span>
                            <span>{location.humidity.toFixed(1)} %</span>
                          </div>
                        </div>
                        {/* 세로 구분선 */}
                        <div className="mx-2 h-8 w-px bg-gray-200" />
                        {/* 저감시설 동작 뱃지 영역 */}
                        {location.type === '지점형' && facilityStatus && (
                          <div className="flex flex-col items-center whitespace-nowrap">
                            <span className="text-[11px] text-gray-400 mb-0.5">저감시설</span>
                            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold text-white ${facilityStatus.color}`}>{facilityStatus.text}</span>
                          </div>
                        )}
                        {/* 구역형: 풍향/풍속 항상 표시, 선택된 마커는 상세정보 모달 windData 사용 */}
                        {location.type === '구역형' && windDataForArea && (
                          <div className="flex flex-col items-center whitespace-nowrap">
                            <span className="text-[11px] text-gray-400 mb-0.5">풍속 {windDataForArea.baseSpeed} m/s</span>
                            <svg width="28" height="28" viewBox="0 0 28 28">
                              <g style={{ transform: `rotate(${(() => {
                                const dirToDeg = {N:0, NE:45, E:90, SE:135, S:180, SW:225, W:270, NW:315};
                                return dirToDeg[windDataForArea.direction] || 0;
                              })()}deg)`, transformOrigin: '14px 14px' }}>
                                <line x1="14" y1="24" x2="14" y2="6" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                                <polygon points="14,2.1 8.8,11.3 19.2,11.3" fill="#2563eb" />
                              </g>
                  </svg>
                  </div>
                        )}
                </div>
                    </div>
                  )}
              </MapMarker>
              );
            })}
            {/* 악취영향권(반경 원) */}
            {showComplaintCircle && randomComplaintPoints.map((p) => (
                <Circle
                key={`complaint-circle-${p.id}`}
                center={p.position}
                radius={150}
                  strokeWeight={2}
                strokeColor="#FF9800"
                strokeOpacity={0.15}
                fillColor="#FF9800"
                fillOpacity={0.15}
              />
            ))}
          </Map>
          {/* 기상상황 */}
          {showWeather && (
            <div className="absolute left-4 bottom-4 bg-white rounded p-4 z-40 min-w-[220px] flex flex-col items-center shadow-md shadow-gray-300/40">
              <div className="font-bold mb-2 text-left w-full">기상상황</div>
              {/* 8각형 나침반 + 방위선 + 양방향 화살표(화살촉/깃털) 풍향 SVG */}
              <div className="flex flex-col items-center mb-2">
                <svg width="210" height="165" viewBox="0 0 210 165">
                  {/* 8각형 */}
                  {(() => {
                    const cx = 105, cy = 82.5, r = 66;
                    const points = Array.from({length: 8}).map((_, i) => {
                      const angle = (Math.PI / 4) * i - Math.PI / 2;
                      return [
                        cx + r * Math.cos(angle),
                        cy + r * Math.sin(angle)
                      ];
                    });
                    return (
                      <polygon points={points.map(p => p.join(",")).join(" ")} fill="#f3f4f6" stroke="#94a3b8" strokeWidth="3" />
                    );
                  })()}
                  {/* 8각형 꼭짓점에서 중심을 지나는 라인 */}
                  {(() => {
                    const cx = 105, cy = 82.5, r = 66;
                    return Array.from({length: 8}).map((_, i) => {
                      const angle = (Math.PI / 4) * i - Math.PI / 2;
                      const x = cx + r * Math.cos(angle);
                      const y = cy + r * Math.sin(angle);
                      return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#d1d5db" strokeWidth="1.5" />;
                    });
                  })()}
                  {/* 8방위 텍스트 (작고 밝은 회색, 폰트 잘리지 않게 y좌표 조정) */}
                  {(() => {
                    const cx = 105, cy = 82.5, r = 80;
                    const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
                    return dirs.map((dir, i) => {
                      const angle = (Math.PI / 4) * i - Math.PI / 2;
                      const x = cx + r * Math.cos(angle);
                      let y = cy + r * Math.sin(angle);
                      if (i === 0) y += 10;
                      else if (i === 4) y -= 2;
                      else y += 4;
                      return <text key={dir} x={x} y={y} textAnchor="middle" fontSize="12" fill="#b0b4ba">{dir}</text>;
                    });
                  })()}
                  
                  {/* 중심을 기준으로 양쪽 길이가 완전히 동일하게(화살촉 끝까지) */}
                  {(() => {
                    const cx = 105, cy = 82.5, len = 28; // 기존 40의 70%
                    const arrowLen = 14.7, arrowWidth = 10.5; // 기존 9.8, 7의 1.5배
                    const angle = (weather.windDir - 90) * Math.PI / 180;
                    // 양쪽 모두 같은 길이(화살촉 끝까지)
                    const totalLen = len + arrowLen;
                    // 화살촉이 없는 쪽
                    const x1 = cx - totalLen * Math.cos(angle);
                    const y1 = cy - totalLen * Math.sin(angle);
                    // 화살촉이 있는 쪽: 선 끝점
                    const x2 = cx + len * Math.cos(angle);
                    const y2 = cy + len * Math.sin(angle);
                    // 화살촉 꼭짓점(선 연장선상, 전체 길이 len+arrowLen)
                    const tipX = cx + totalLen * Math.cos(angle);
                    const tipY = cy + totalLen * Math.sin(angle);
                    // 화살촉 밑변 좌우
                    const leftX = x2 - arrowWidth * Math.cos(angle - Math.PI / 2);
                    const leftY = y2 - arrowWidth * Math.sin(angle - Math.PI / 2);
                    const rightX = x2 - arrowWidth * Math.cos(angle + Math.PI / 2);
                    const rightY = y2 - arrowWidth * Math.sin(angle + Math.PI / 2);
                    return <g>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
                      <polygon points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`} fill="#2563eb" />
                    </g>;
                  })()}
                </svg>
                {/* 차트 바로 밑 온도/습도 텍스트 삭제 */}
                {/* <div className="flex flex-row justify-center items-center gap-6 mt-3 mb-1">
                  <div>온도: {weather.temp} ℃</div>
                  <div>습도: {weather.humidity} %</div>
                </div> */}
                <div className="text-xs text-gray-500 mt-1">
                  풍향: {
                    (() => {
                      const windAngles = [0, 45, 90, 135, 180, 225, 270, 315];
                      const windDirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
                      const idx = windAngles.indexOf(weather.windDir);
                      return idx !== -1 ? windDirs[idx] : '';
                    })()
                  }
              </div>
              </div>
              {/* 풍속 값 텍스트 + Bar 차트 */}
              <div className="w-full mb-2 flex flex-col items-center" style={{marginBottom: '0px'}}>
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
                          color: '#2563eb',
                          font: { size: 15, weight: 'bold' },
                          padding: 8,
                          callback: function(value) { return value; }
                        },
                        grid: { display: true, color: '#e5e7eb' }
                      },
                      y: { grid: { display: false }, ticks: { display: false } }
                    },
                    layout: { padding: { bottom: 24 } }
                  }}
                  height={60}
                />
              </div>
              {/* 맨 아래 온도/습도 텍스트를 Bar 차트와 박스 하단 중간에 위치, 굵게 */}
              <div className="flex flex-row justify-center items-center gap-6 mt-2 mb-2 font-bold text-orange-500">
                  <div>온도: {weather.temp} ℃</div>
                  <div>습도: {weather.humidity} %</div>
              </div>
            </div>
          )}
          {/* 악취지점 상세 정보 및 그래프 */}
          {selectedLocation && (
            <div
              className={`fixed bg-white rounded shadow p-4 ${selectedLocation.type === '구역형' ? 'w-[800px]' : 'w-96'}`}
              style={isMobile ? {
                left: '50%',
                right: 'auto',
                bottom: '1rem',
                top: 'auto',
                transform: 'translateX(-50%)',
                zIndex: 99999,
                position: 'fixed',
                maxWidth: '95vw',
                width: selectedLocation.type === '구역형' ? '95vw' : '90vw',
                minWidth: 0
              } : {
                right: '1rem',
                bottom: '1rem', // ← 이 줄을 추가!
                zIndex: 99999,
                position: 'fixed'
              }}
            >
              {/* 우측 상단 닫기 버튼 */}
              <button onClick={() => setSelectedLocation(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* 지점형 저감시설 뱃지: X 아이콘 바로 아래에 하나만 표시 */}
                    {selectedLocation.type === '지점형' && (() => {
                      const idx = odorLocations.findIndex(loc => loc.id === selectedLocation.id);
                      let isErrorTarget = false;
                      if (idx === 0) isErrorTarget = true;
                      const facilityStatus = getFacilityStatusByIndex(idx, isErrorTarget, selectedLocation.grade);
                      const textColor = facilityStatus.text === '가동' ? 'text-black' : 'text-white';
                      return (
                  <span className={`absolute right-6 top-12 px-3 py-1 rounded text-xs font-semibold flex items-center ${facilityStatus.color} ${textColor} z-10`}>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
                          </svg>
                          {facilityStatus.text}
                  </span>
                      );
                    })()}
              <div className={`${selectedLocation.type === '구역형' ? 'grid grid-cols-2 gap-6' : ''}`}>
                {/* 왼쪽 구역: 기본 정보 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold mr-2 ${selectedLocation.type === '지점형' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedLocation.type}</span>
                      <span className="font-bold">
                        {selectedLocation.name}
                      </span>
                    </div>
                    {/* 시설관리 버튼(저감시설 상태 뱃지) 삭제 */}
                  </div>
                  <div className="mb-2 flex items-center">
                    <span className="font-bold text-xl mr-2">등급:</span>
                    <span className="font-bold text-2xl" style={{ color: getLabelColor(selectedLocation.grade) }}>{selectedLocation.grade}</span>
                  </div>
                  {/* 시설상태 뱃지: 등급 아래 줄에 별도 표시 부분 삭제 */}
                  <div className="mb-2 flex items-center">
                    <span className="font-bold text-xl mr-2">황화수소(H₂S):</span>
                    <span className="font-bold text-2xl">{selectedLocation.h2s} ppm</span>
                  </div>
                  <div className="mb-2">온도: {selectedLocation.temp} ℃</div>
                  <div className="mb-2">습도: {selectedLocation.humidity} %</div>
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

                {/* 오른쪽 구역: 바람장 정보 (구역형일 때만 표시) */}
                {selectedLocation?.type === '구역형' && windData && (
                  <div>
                    <div className="mb-2 font-bold text-lg">바람장 분석</div>
                    <div className="mb-2 text-sm text-gray-600">
                      <div className="mb-1">풍향: {windData.directionKor} / 풍속: {windData.baseSpeed} m/s</div>
                      <div>기압: {windData.pressure} hPa</div>
                    </div>
                    <div className="w-4/5 mx-auto">
                      <Radar
                        data={{
                          labels: windData.labelsKor,
                          datasets: [
                            {
                              label: '풍속 (m/s)',
                              data: windData.data,
                              backgroundColor: 'rgba(54, 162, 235, 0.2)',
                              borderColor: 'rgba(54, 162, 235, 1)',
                              borderWidth: 2,
                              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                              pointBorderColor: '#fff',
                              pointHoverBackgroundColor: '#fff',
                              pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 4,
                              ticks: {
                                stepSize: 1
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}
                        height={200}
                      />
                    </div>
            </div>
          )}
            </div>
          </div>
          )}
          {/* 등급 기준 + 저감시설 동작 범례 2열 모달 */}
          <div
            className="absolute bottom-4 right-[1rem] bg-white p-4 rounded shadow text-sm z-20 w-96 flex flex-row gap-8"
            style={isMobile ? {
              left: '50%',
              right: 'auto',
              bottom: '1rem',
              top: 'auto',
              transform: 'translateX(-50%)',
              width: '90vw',
              minWidth: 0,
              maxWidth: '95vw',
              position: 'fixed',
              zIndex: 20
            } : { right: '1rem', bottom: '1rem', position: 'absolute', zIndex: 20 }}
          >
            {/* 왼쪽 열: 악취 등급 */}
            <div className="flex-[1.1]">
              <h3 className="text-sm font-semibold mb-2">악취 등급(H₂S, ppm)</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#2563eb] mr-2"></div>
                  <span className="text-sm">매우좋음 (0.005 이하)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#8BC34A] mr-2"></div>
                  <span className="text-sm">좋음 (0.01 이하)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#FFC107] mr-2"></div>
                  <span className="text-sm">보통 (0.1 이하)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#FF9800] mr-2"></div>
                  <span className="text-sm">나쁨 (2.0 이하)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#F44336] mr-2"></div>
                  <span className="text-sm">매우나쁨 (2.0 초과)</span>
                </div>
              </div>
            </div>
            {/* 오른쪽 열: 저감시설 동작 */}
            <div className="flex-[0.5] border-l border-gray-200 pl-8">
              <h3 className="text-sm font-semibold mb-2">저감시설 동작</h3>
              <div className="flex flex-col gap-2">
                <span className="inline-block px-3 py-1 rounded text-xs font-bold text-white bg-green-500 w-fit">가동</span>
                <span className="inline-block px-3 py-1 rounded text-xs font-bold text-white bg-gray-400 w-fit">대기</span>
                <span className="inline-block px-3 py-1 rounded text-xs font-bold text-white bg-red-500 w-fit">점검</span>
              </div>
            </div>
          </div>
          {/* 지오코딩 모달 */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[999999]">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[700px] max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">주소 일괄 좌표 변환</h3>
                <textarea
                  className="w-full border rounded px-2 py-1 mb-2 text-sm font-mono"
                  rows={6}
                  placeholder="명칭, 주소를 한 줄에 하나씩 입력하세요.\n예시: GS25 백운사랑점, 광주광역시 남구 백운동 123-4"
                  value={bulkInput}
                  onChange={e => setBulkInput(e.target.value)}
                  disabled={bulkLoading}
                />
                <button className="w-full bg-blue-500 text-white rounded py-1 font-semibold mb-2" onClick={async () => {
                  setBulkError('');
                  setBulkResults([]);
                  setCopySuccess(false);
                  setBulkLoading(true);
                  const lines = bulkInput.split('\n').map(l => l.trim()).filter(Boolean);
                  const results = [];
                  for (let i = 0; i < lines.length; i++) {
                    const [name, ...addrArr] = lines[i].split(',');
                    const address = addrArr.join(',').trim();
                    if (!name || !address) {
                      results.push({ name: name || '', address, status: '입력오류', lat: '', lng: '', type: '지점형' });
                      continue;
                    }
                    try {
                      const res = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
                        { headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` } });
                      const data = await res.json();
                      if (data.documents && data.documents.length > 0) {
                        results.push({
                          name: name.trim(),
                          address,
                          lat: data.documents[0].y,
                          lng: data.documents[0].x,
                          status: '성공',
                          type: '지점형'
                        });
                      } else {
                        results.push({ name: name.trim(), address, status: '실패', lat: '', lng: '', type: '지점형' });
                      }
                    } catch {
                      results.push({ name: name.trim(), address, status: 'API오류', lat: '', lng: '', type: '지점형' });
                    }
                  }
                  setBulkResults(results);
                  setBulkLoading(false);
                }}>일괄 변환</button>
                {bulkError && <div className="text-red-500 text-sm mb-2">{bulkError}</div>}
                {bulkResults.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-xs border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-1 border">명칭</th>
                          <th className="p-1 border">주소</th>
                          <th className="p-1 border">위도</th>
                          <th className="p-1 border">경도</th>
                          <th className="p-1 border">상태</th>
                          <th className="p-1 border">유형</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkResults.map((row, idx) => (
                          <tr key={idx} className={row.status === '성공' ? '' : 'bg-red-50'}>
                            <td className="border p-1">{row.name}</td>
                            <td className="border p-1">{row.address}</td>
                            <td className="border p-1">{row.lat}</td>
                            <td className="border p-1">{row.lng}</td>
                            <td className="border p-1">{row.status}</td>
                            <td className="border p-1">
                              {row.status === '성공' ? (
                                <>
                                  <label className="mr-2">
                                    <input type="radio" name={`type-${idx}`} value="지점형" checked={row.type === '지점형'} onChange={() => {
                                      setBulkResults(r => r.map((v, i) => i === idx ? { ...v, type: '지점형' } : v));
                                    }} /> 지점형
                                  </label>
                                  <label>
                                    <input type="radio" name={`type-${idx}`} value="구역형" checked={row.type === '구역형'} onChange={() => {
                                      setBulkResults(r => r.map((v, i) => i === idx ? { ...v, type: '구역형' } : v));
                                    }} /> 구역형
                                  </label>
                                </>
                              ) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end mt-4">
                      <button
                        className="px-4 py-1 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700"
                        onClick={async () => {
                          const codeArr = bulkResults.filter(r => r.status === '성공').map((r, i) =>
                            `  { id: ${i + 1}, type: '${r.type}', markerLabel: '${r.type === '지점형' ? 'P0' : 'A'}', name: '${r.name}', position: { lat: ${r.lat}, lng: ${r.lng} } }`
                          );
                          const code = '[\n' + codeArr.join(',\n') + '\n]';
                          await navigator.clipboard.writeText(code);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                      >코드 복사</button>
                      {copySuccess && <span className="ml-2 text-green-600 font-semibold">복사됨!</span>}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold" onClick={() => {
                    setShowAddModal(false);
                    setBulkInput('');
                    setBulkResults([]);
                    setBulkError('');
                    setCopySuccess(false);
                  }}>닫기</button>
                </div>
              </div>
            </div>
          )}
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
                    <td className="font-semibold bg-gray-50 p-2">배수구명</td>
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
    } else if (selectedTab === '분석 지도') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg border border-gray-200">
          <span className="text-gray-400">분석 지도 표시 영역</span>
        </div>
      );
    }
    return null;
  };

  // showOdor가 true로 바뀔 때마다 등급/값 랜덤 변경
  useEffect(() => {
    if (showOdor) {
      const newGradeDist = assignGradesByDistance(baseOdorLocations);
      setOdorLocations(
        baseOdorLocations.map((loc, idx) => {
          const grade = newGradeDist[idx];
          const value = getRandomValueByGrade(grade);
          const temp = getRandomTemp();
          const humidity = getRandomHumidity();
          return {
            ...loc,
            value,
            nh3: getRandomNH3(),
            h2s: value,
            co2: getRandomCO2(),
            temp,
            humidity,
            timeSeries: getRandomTimeSeries(value),
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
            grade
          };
        })
      );
    }
  }, [showOdor]);

  // 지도유형/레이어/설정 버튼 (모바일 우측 상단)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // PC 환경에서만 기상정보, 악취 발생현황 모달을 기본적으로 보이게 설정
  useEffect(() => {
    if (!isMobile) {
      setShowWeather(true);
      setShowOdorList(true);
    } else {
      setShowWeather(false);
      setShowOdorList(false);
    }
  }, [isMobile]);

  // 시설관리(시설 지도) 탭 진입 시 첫 번째 시설 자동 선택
  useEffect(() => {
    if (selectedTab === '시설 지도' && pipeLocations.length > 0) {
      setSelectedPipeInfo(pipeInfoExample);
      setMapCenter(pipeLocations[0].position);
      if (mapRef.current) {
        mapRef.current.setLevel(3);
      }
    }
  }, [selectedTab]);

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
        {/* 모바일 우측 상단 버튼 */}
        <div className="absolute top-4 right-4 z-50 flex space-x-2 md:hidden pointer-events-auto">
          <button onClick={() => setShowTabMenu(true)} className="bg-white rounded-full p-2 shadow hover:bg-gray-100">
            <FiSettings className="w-6 h-6 text-gray-700" />
          </button>
          <button onClick={() => setShowLayerControl(!showLayerControl)} className="bg-white rounded-full p-2 shadow hover:bg-gray-100">
            <FiLayers className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        {/* 지도유형 선택 모달 (모바일) */}
        {showTabMenu && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30 pointer-events-auto" onClick={() => setShowTabMenu(false)}>
            <div className="bg-white rounded-lg shadow-lg p-6 w-72 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowTabMenu(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="font-bold text-lg mb-4">지도 유형 선택</div>
              {['악취 등급 지도', '시설 지도', '분석 지도'].map(tab => (
                <button
                  key={tab}
                  className={`w-full mb-2 px-4 py-2 rounded text-base font-semibold ${selectedTab === tab ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-teal-100'}`}
                  onClick={() => { setSelectedTab(tab); setShowTabMenu(false); }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* 레이어 관리 모달 (모바일/PC) */}
        {showLayerControl && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30 pointer-events-auto" onClick={() => setShowLayerControl(false)}>
            <div className="bg-white rounded-lg shadow-lg p-6 w-80" onClick={e => e.stopPropagation()}>
              <div className="font-bold text-lg mb-4 flex items-center justify-between">
                <span>레이어 관리</span>
                <button onClick={() => setShowLayerControl(false)} className="text-gray-400 hover:text-gray-700"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              {/* 기존 레이어 관리 내용 복사 */}
              <button className="w-full mb-2 px-2 py-1 bg-blue-500 text-white rounded text-sm font-semibold hover:bg-blue-600" onClick={() => setShowAddModal(true)}>지점 추가</button>
              <label className="block"><input type="checkbox" checked={showOdor} onChange={e => setShowOdor(e.target.checked)} /> 악취측정지점</label>
              {showOdor && (
                <div className="ml-6 mt-1 space-y-1 text-sm">
                  <label className="block"><input type="checkbox" checked={showFacilityPin} onChange={e => setShowFacilityPin(e.target.checked)} /> 측정시설</label>
                  <label className="block"><input type="checkbox" checked={showFacilityInfo} onChange={e => setShowFacilityInfo(e.target.checked)} /> 측정정보</label>
                </div>
              )}
              <label className="block"><input type="checkbox" checked={showOdorList} onChange={e => setShowOdorList(e.target.checked)} /> 악취 발생 현황</label>
              <label className="block"><input type="checkbox" checked={showComplaintLayer} onChange={e => setShowComplaintLayer(e.target.checked)} /> 민원발생지점</label>
              <label className="block"><input type="checkbox" checked={showComplaintCircle} onChange={e => setShowComplaintCircle(e.target.checked)} /> 악취영향권</label>
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
          </div>
        )}
        {/* 기존 지도유형 메뉴바는 md 이상에서만 노출 */}
        <div className="pointer-events-auto hidden md:block">
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
              <h3 className="text-lg font-semibold mb-4">악취측정지점</h3>
              <div className="space-y-4 overflow-y-auto">
                {pagedOdorLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`p-4 rounded cursor-pointer ${selectedLocation?.id === location.id ? 'bg-teal-50 border-2 border-teal-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold mr-2 ${location.type === '지점형' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{location.type}</span>
                        <h4 className="font-medium inline">{location.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">악취 강도: <span style={{ color: getLabelColor(location.grade), fontWeight: 'bold' }}>{location.grade}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* 페이지네이션 */}
              <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-teal-100 font-semibold"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                  </button>
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (currentPage <= 3) {
                    pageNum = idx + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = currentPage - 2 + idx;
                  }
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        className={`w-8 h-8 rounded-full font-semibold text-sm focus:outline-none transition-colors duration-200 ${
                          currentPage === pageNum ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-teal-100'
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-teal-100 font-semibold"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
        {renderTabContent()}
        {selectedLocation && isMobile && selectedLocation.type === '구역형' && (
          <div
            className="fixed bg-white rounded shadow p-4"
            style={{
              left: '50%',
              bottom: '1rem',
              transform: 'translateX(-50%)',
              zIndex: 99999,
              position: 'fixed',
              maxWidth: '95vw',
              width: '95vw',
              minWidth: 0
            }}
          >
            {/* 캐로셀 컨트롤 */}
            <div className="flex justify-between items-center mb-2">
              <button
                className="text-2xl px-2"
                onClick={() => setAreaDetailPage(p => Math.max(0, p - 1))}
                disabled={areaDetailPage === 0}
              >〈</button>
              <span className="text-sm text-gray-500">{areaDetailPage + 1} / 2</span>
              <button
                className="text-2xl px-2"
                onClick={() => setAreaDetailPage(p => Math.min(1, p + 1))}
                disabled={areaDetailPage === 1}
              >〉</button>
            </div>
            {/* 캐로셀 페이지 */}
            {areaDetailPage === 0 ? (
              // 왼쪽: 황화수소 등급/기본정보
              <div>
                <div className="mb-2 flex items-center">
                  <span className="font-bold text-xl mr-2">등급:</span>
                  <span className="font-bold text-2xl" style={{ color: getLabelColor(selectedLocation.grade) }}>{selectedLocation.grade}</span>
                </div>
                <div className="mb-2 flex items-center">
                  <span className="font-bold text-xl mr-2">황화수소(H₂S):</span>
                  <span className="font-bold text-2xl">{selectedLocation.h2s} ppm</span>
                </div>
                <div className="mb-2">온도: {selectedLocation.temp} ℃</div>
                <div className="mb-2">습도: {selectedLocation.humidity} %</div>
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
            ) : (
              // 오른쪽: 바람장 분석
              <div>
                <div className="mb-2 font-bold text-lg">바람장 분석</div>
                <div className="mb-2 text-sm text-gray-600">
                  <div className="mb-1">풍향: {windData.directionKor} / 풍속: {windData.baseSpeed} m/s</div>
                  <div>기압: {windData.pressure} hPa</div>
                </div>
                <div className="w-4/5 mx-auto">
                  <Radar
                    data={{
                      labels: windData.labelsKor,
                      datasets: [
                        {
                          label: '풍속 (m/s)',
                          data: windData.data,
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                          borderWidth: 2,
                          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                          pointBorderColor: '#fff',
                          pointHoverBackgroundColor: '#fff',
                          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 4,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                    height={200}
                  />
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default OdorMap;