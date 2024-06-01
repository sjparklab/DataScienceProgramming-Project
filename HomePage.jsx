import React, { useEffect } from 'react';
import './HomePage.css'; // Custom CSS file for additional styling

const App = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          entry.target.classList.remove('hide');
        } else {
          entry.target.classList.remove('show');
          entry.target.classList.add('hide');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-scroll-fadein').forEach((section) => {
      observer.observe(section);
    });

    const fullscreenMessage = document.querySelector('.fullscreen-message');
    observer.observe(fullscreenMessage);
  }, []);

  return (
    <div className="App">
      <div className="fullscreen-video-wrap">
        <video src="KakaoTalk_20240601_071254025.mp4" autoPlay muted loop></video>
      </div>

      <header className="header">
        <h1>SingleNest</h1>
        <nav>
          <ul>
            <li><a href="#home">home</a></li>
            <li><a href="#analysis">analysis</a></li>
            <li><a href="#map">map</a></li>
            <li><a href="#recommendation">recommendation</a></li>
          </ul>
        </nav>
      </header>

      <div className="fullscreen-message animate-scroll-fadein" id="fullscreen-message">
        <h1>현대 사회에서 1인 가구의 수가 급격히 증가하고 있습니다.</h1>
        <p>이는 다양한 사회적, 경제적 변화에 기인한 현상으로, 개인의 생활 방식과 주거 패턴에도 큰 영향을 미치고 있습니다.<br />
          이러한 트렌드를 반영하여, 우리는 1인 가구를 위한 주거지역 추천 웹사이트인 SingleNest를 기획하게 되었습니다.</p>
      </div>

      <div className="container-home">
        <Section id="home" title="데이터 분석 및 시각화" imgSrc="your-image-path.jpg" imgAlt="1인 가구 증가">
          <p>1인 가구 수, 전체 가구 수, 지역별 1인 가구 비율과 주거 환경 요소들의 상관관계를 분석하여<br />
            글로 정리하고 그래프로 나타냅니다.<br />
            이를 통해 사용자에게 각 요소가 1인 가구 주거 선택에 미치는 영향을<br />
            명확하게 이해할 수 있도록 합니다.</p>
        </Section>

        <Section id="features" title="지도 기반 시각화" imgSrc="your-image-path.jpg" imgAlt="지도 기반 시각화">
          <p>1인 가구 수, 주택 가격 평균, 대중교통(버스, 지하철) 수, 상점 수를<br />
            읍면동 별로 색깔을 사용하여 지도에 비교하여 나타냅니다.<br />
            이를 통해 사용자는 각 지역의 주요 주거 환경 요소들을 한눈에 파악할 수 있습니다.</p>
        </Section>

        <Section id="recommendation" title="주거 지역 추천 프로그램" imgSrc="your-image-path.jpg" imgAlt="주거 지역 추천 프로그램">
          <p>사용자가 자신의 학교나 회사가 위치한 읍면동을 선택하고,<br />
            대중교통 접근성, 상권 데이터의 중요도, 원하는 주택 가격의 범위를 입력하면,<br />
            해당 정보를 바탕으로 최적의 주거 지역을 추천합니다.<br />
            이 기능은 개인의 요구에 맞춘 맞춤형 주거 솔루션을 제공합니다.</p>
        </Section>

        <Section id="benefits" title="기대 효과" imgSrc="your-image-path.jpg" imgAlt="기대 효과">
          <p>SingleNest를 통해 1인 가구는 자신의 생활 패턴과 예산에 맞는 최적의 주거지를 쉽게 찾을 수 있습니다.<br />
            이는 1인 가구의 생활 편의성을 높이고, 주거 안정성을 확보하는 데 큰 도움이 될 것입니다.<br />
            또한, 주거 지역 선택 과정에서 발생할 수 있는 시간을 절약하고, 보다 합리적인 의사 결정을 내릴 수 있도록 지원합니다.</p>
        </Section>

        <div className="main centered-text animate-scroll-fadein" id="conclusion">
          <div>
            <p>1인 가구의 증가 추세에 발맞추어,<br />
              SingleNest는 개인의 요구에 맞춘 맞춤형 주거 솔루션을 제공합니다.<br />
              이를 통해 많은 1인 가구가 더욱 편리하고 만족스러운 주거 환경을 찾을 수 있기를 기대합니다.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2024 SingleNest. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const Section = ({ id, title, imgSrc, imgAlt, children }) => (
  <div className="main animate-scroll-fadein" id={id}>
    <img src={imgSrc} alt={imgAlt} />
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);

export default App;
