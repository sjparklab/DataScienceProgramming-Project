# 1인 가구 분포 지도 시각화 (singlenest)

통계청 마이크로데이터를 기반으로 국내 1인 가구 현황을 분석하고, 지도(Mapbox GL + deck.gl)로 시각화한 웹 애플리케이션입니다.  
Python(pandas)로 데이터 전처리·분석을 수행하고, React 기반 UI에서 지역별 지표를 인터랙티브하게 탐색할 수 있습니다.

---

## 프로젝트 개요
- 목표: 1인 가구의 지역별 분포·환경(교통/상권/가격)을 한눈에 파악하고, 조건에 따라 거주 후보 지역을 추천
- 구성: 분석(그래프/히트맵) · 지도(시군구/읍면동 Choropleth) · 추천(입력 조건 기반 점수화) 페이지

---

## 데이터 출처
- 통계청 주민등록 인구통계(1인 세대 수, 전체 세대 수, 인구 수)
- 국토교통부 실거래가 공개시스템(소형주택 전·월세)
- 국토교통부 전국 버스정류장/도시철도 역사 정보
- 통계청 센서스 기준 행정동 코드

---

## 기술 스택
- **Frontend**: React, Mapbox GL JS, deck.gl, react-map-gl, D3(d3-scale, d3-scale-chromatic), @turf/turf, MUI, styled-components/@emotion, Vite
- **Backend**: Node.js(Express), csv-parser, cors, dotenv
- **Data/Analysis**: Python 3.x, pandas, matplotlib

---

## 주요 구현 기능

### 1) 데이터 처리
- 마이크로데이터 수집(수동 실행), 결측/이상치 처리, 지역명·행정동코드 정합화
- 지표 산출: 시군구/읍면동 단위로 교통(버스/지하철), 상권(업종 분류), 주택 가격(전·월세), 1인 가구 비율 등 집계
- 전월세 전환율을 이용한 가격 지표 보정(월세→보증금 환산 등)

### 2) 분석 페이지
- 선/막대/도넛형 그래프 및 히트맵으로 지표 간 상관관계 요약
- 시도/시군구 단위 증감 추이와 분포 비교

### 3) 지도 페이지
- 시군구/읍면동 GeoJSON Choropleth(색상 스케일로 지표 구간화)
- 마우스 오버 툴팁(지역별 상세 지표), 2D/3D(고도) 표현
- 지표 토글(교통/상권/가격/세대 등)로 즉시 재색칠

### 4) 추천 페이지
- 입력: 기준 위치(학교/회사), 예산/면적, 거주 형태, 지표 가중치(교통/상권/가격 등)
- 서버에서 정규화(0~1) 및 가중합으로 점수 계산 → 상위 후보 지역 반환
- 거리/가격 필터링(centroid 거리 기반, 예산 범위 필터) 후 정렬

### 5) 서버/API
- `GET /geojson/:type` : 타입별 GeoJSON 제공
- `POST /update-geojson/:type` : 가중치/상태에 따라 속성 재계산
- `POST /api/recommend` : 입력 조건 기반 추천 결과 반환

---

## 팀원
- 김유림(팀장): 데이터 수집, 주택 가격 전처리, 홈/분석 페이지, 발표
- 박성종: 데이터 처리/분석, 지도 시각화, 서버(API), UI·UX, 전체 구현 주도
- 김미진: 데이터 수집, 행정동 코드 수기 보정
- 배찬혁: 데이터 수집, 상권 전처리·시각화, 발표자료 제작
- 이수아: 데이터 수집, 행정동 코드 수기 보정

---

## 환경 변수 (선택)
> 실행/배포 안내는 생략하지만, 구현 이해를 돕기 위한 키 이름만 명시합니다.
- 클라이언트: `VITE_MAPBOX_ACCESS_TOKEN`, `VITE_GEOJSON_URL`, `VITE_UPDATE_GEOJSON_URL`, `VITE_RECOMMENDED_URL`
- 서버: `ALLOWED_ORIGINS`, `PORT`

---

## 비고
- 당시 운영은 Express로 정적 서빙 + API 처리 중심으로 진행.  
  (Nginx 정적 서빙/리버스 프록시도 가능하며, 개발 단계에선 Vite dev 서버로 미리보기 테스트)
- 대용량 데이터셋은 별도 저장소 또는 배포 스토리지에서 로드하도록 구성 가능.

---

## 스크린샷
![스크린샷 2025-08-10 112701](https://github.com/user-attachments/assets/61da594c-937a-4b81-81fb-435f1ec13780)
![스크린샷 2025-08-10 112705](https://github.com/user-attachments/assets/31fa5da7-cd43-446f-bac1-e3611dac70ac)
![스크린샷 2025-08-10 112708](https://github.com/user-attachments/assets/fe0373d5-8d16-4c86-a342-913196f3813a)
![스크린샷 2025-08-10 112712](https://github.com/user-attachments/assets/a0cac930-841e-458b-b226-319cfcc15b7b)
![스크린샷 2025-08-10 112715](https://github.com/user-attachments/assets/86058090-f796-4682-a58d-1151079aa54f)
![스크린샷 2025-08-10 112717](https://github.com/user-attachments/assets/b8493577-ac15-41b9-a34d-61d4a42b474c)
