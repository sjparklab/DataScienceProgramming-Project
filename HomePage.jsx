import React, { useEffect } from 'react';
import './HomePage.css'; // CSS 파일은 별도로 관리

const App = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.section, .fullscreen-message, .conclusion-text');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div>
      <div className="fullscreen-video-wrap">
        <video src="video.mp4" autoPlay muted loop></video>
      </div>

      <div className="fullscreen-message" id="fullscreen-message">
        <h1><span className="highlight">SingleNest</span>는 1인 가구 둥지 찾기 여정의 동반자입니다.</h1>
        <p>SingleNest는 여러분의 생활 패턴과 예산에 가장 적합한 주거지를 찾는 과정을 단순화하고, 그 과정에서 새로운 편리함을 경험하도록 도와줍니다.
          <br />새가 자신을 위한 완벽한 장소를 찾아 둥지를 틀 듯, SingleNest와 함께라면 여러분도 자신만의 완벽한 보금자리를 찾을 수 있습니다.</p>
      </div>

      <div className="container-home">
        <div className="section" id="home">
          <div className="box">
            <img src="홈 삽입 사진/graph.jpg" alt="1인 가구 증가" className="inverted-image" />
          </div>
          <div className="box text-content data-visualization">
            <h2><span className="highlight">그래프 기반 </span><span className="highlight-white">데이터 분석</span><span className="highlight">으로<br />1인 가구 관련 데이터 쉽게 이해</span></h2>
            <p>1인 가구 수, 전체 가구 수, 1인 가구 비율, 주거 환경 요소들 간의 상관관계를
              <br />막대 그래프, 히트맵 등으로 분석하고 시각화합니다.</p>
          </div>
        </div>

        <div className="section" id="features">
          <div className="box text-content map-visualization">
            <h2><span className="highlight">전국 단위의 데이터를<br /></span><span className="highlight-white">지도</span><span className="highlight">로 한 눈에 파악</span></h2>
            <p>1인 가구 수, 소형 주택 평당 가격, 대중교통 수, 상업 시설 수를
              <br />시군구와 읍면동 단위로 비교하여 지도에 시각화합니다.</p>
          </div>
          <div className="box">
            <img src="홈 삽입 사진/map.png" alt="지도 기반 시각화" />
          </div>
        </div>

        <div className="section" id="recommendation">
          <div className="box">
            <img src="홈 삽입 사진/굳.png" alt="주거 지역 추천 프로그램" className="inverted-image" />
          </div>
          <div className="box text-content recommendation">
            <h2><span className="highlight">사용자 맞춤 </span><span className="highlight-white">주거 지역 추천</span></h2>
            <p>사용자가 자신의 학교나 회사가 위치한 읍면동을 선택하고,<br />
              대중교통 접근성, 주택 평당 가격, 상권 데이터의 중요도를 선택하면,
              <br />해당 정보를 바탕으로 최적의 주거 지역을 추천합니다.</p>
          </div>
        </div>
      </div>

      <div className="conclusion-text">
        <p>1인 가구의 증가 추세에 발맞추어,<br /><span className="highlight">SingleNest</span>는 개인의 요구에 맞춘 맞춤형 주거 솔루션을 제공합니다.<br />이를 통해 많은 1인 가구가 더욱 편리하고 만족스러운 주거 환경을 찾을 수 있기를 기대합니다.</p>
      </div>

      <footer className="footer">
        <p>&copy; 2024 SingleNest. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;