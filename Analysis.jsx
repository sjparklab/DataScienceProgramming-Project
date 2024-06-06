// App.js
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// 전역 스타일 정의
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');
  
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden;
    background-color: #000;
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1.6;
    color: #CCCCCC;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  font-weight: bold;
`;

const Nav = styled.nav`
  margin-right: 20px;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`;

const NavItem = styled.li`
  margin-left: 30px;
`;

const NavLink = styled.a`
  color: #FFFFFF;
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: auto;
  overflow: hidden;
  padding-top: 100px;
`;

const Section = styled.div`
  background: #000000;
  padding: 40px;
  margin: 20px 0;
`;

const SectionTitle = styled.h3`
  color: #FFFFFF;
`;

const Graph = styled.div`
  width: 100%;
  height: ${({ height }) => height || '1200px'};
  background: #FFFFFF;
  color: #e5e5e5;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;
`;

const GraphImage = styled.img`
  width: 48%;
  margin: 1%;
  border-radius: 10px;
`;

const TextSection = styled.div`
  width: 100%;
  background: #FFFFFF;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
  height: ${({ height }) => height};
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px;
  background: #000000;
  color: #fff;
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Section>
          <SectionTitle>세대 구성 형태의 변화 분석</SectionTitle>
          <Graph>
            <GraphImage src="그래프/그래프 영역 1/1. 연도별 세대수변화.png" alt="연도별 세대수변화" />
            <GraphImage src="그래프/그래프 영역 1/2. 세대 구성 형태 변화.png" alt="세대 구성 형태 변화" />
            <GraphImage src="그래프/그래프 영역 1/3. 2014년 1월 세대 구성 형태.png" alt="2014년 1월 세대 구성 형태" />
            <GraphImage src="그래프/그래프 영역 1/4. 2024년 1월 세대 구성 형태.png" alt="2024년 1월 세대 구성 형태" />
          </Graph>
          <TextSection height="200px">
            <p>지난 10년간 대한민국의 세대 수와 인구 변화를 분석한 결과, 세대 수는 크게 증가한 반면, 인구 증가율은 상대적으로 낮은 수준을 유지하고 있음을 확인할 수 있습니다.

              2014년 1월부터 2023년 12월까지 대한민국의 세대 수는 총 3,447,967세대 증가하여, 2014년 1월의 20,466,884세대에서 2023년 12월의 23,914,851세대로 늘어났습니다. 이는 약 16.8%의 증가율을 나타냅니다. 반면, 같은 기간 동안 전국 인구수는 169,161명 증가하여 2014년 1월의 51,156,168명에서 2023년 12월의 51,325,329명으로 소폭 증가하였으며, 이는 약 0.33%의 증가율입니다. 세대 수 증가율에 비해 인구 증가율은 매우 낮은 수치를 보이고 있습니다.

              세대 유형별로 살펴보면, 지난 10년 동안 4인 이상 세대 수는 감소하는 반면, 1인 세대와 2인 세대 수는 지속적으로 증가하는 추세를 보였습니다. 특히, 1인 세대는 2014년 1월의 6,878,013세대에서 2024년 1월의 9,943,426세대로 3,065,413세대가 증가하였습니다. 이는 1인 세대가 전체 세대 중 차지하는 비율이 33.6%에서 41.6%로 8% 증가한 것을 의미합니다.
            </p>
          </TextSection>
        </Section>
        <Section>
          <SectionTitle>시도별 1인 세대 수 분석</SectionTitle>
          <Graph>
            <GraphImage src="그래프/그래프 영역 2/5. 시도별 1인 세대 수.png" alt="시도별 1인 세대 수" />
            <GraphImage src="그래프/그래프 영역 2/6. 시도별 1인 세대 비율.png" alt="시도별 1인 세대 비율" />
            <GraphImage src="그래프/그래프 영역 2/7. 시도별 1인 세대 수_원.png" alt="시도별 1인 세대 수 원형" />
            <GraphImage src="그래프/그래프 영역 2/8. 시도별 1인 세대 비율_원.png" alt="시도별 1인 세대 비율 원형" />
          </Graph>
          <TextSection height="150px">
            <p>2023년 12월 기준으로 1인 세대 수가 가장 많은 시도는 경기도와 서울특별시입니다. 그러나 1인 세대 비율로 분석한 결과, 모든 시도의 비율이 크게 차이나지 않고 비슷한 수준을 유지하고 있음을 확인할 수 있습니다.

              1인 세대 비율이 가장 높은 세 지역은 전라남도(47.1%), 경상북도(45.6%), 강원특별자치도(45.2%)로 나타났습니다. 이는 해당 지역들이 전체 세대 중에서 1인 세대가 차지하는 비율이 높다는 것을 의미합니다.

              총 17개의 시도 중 1인 세대 수가 가장 많았던 경기도는 37.3%의 비율을 기록하여, 1인 세대 비율로는 15번째에 위치했습니다.
            </p>
          </TextSection>
        </Section>
        <Section>
          <SectionTitle>시군구별 1인 세대 수 분석</SectionTitle>
          <Graph height="1200px" style={{ overflowY: 'scroll' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/서울.png" alt="서울" />
              <GraphImage src="그래프/그래프 영역 3/서울_비.png" alt="서울 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/부산.png" alt="부산" />
              <GraphImage src="그래프/그래프 영역 3/부산_비.png" alt="부산 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/대구.png" alt="대구" />
              <GraphImage src="그래프/그래프 영역 3/대구_비.png" alt="대구 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/인천.png" alt="인천" />
              <GraphImage src="그래프/그래프 영역 3/인천_비.png" alt="인천 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/광주.png" alt="광주" />
              <GraphImage src="그래프/그래프 영역 3/광주_비.png" alt="광주 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/대전.png" alt="대전" />
              <GraphImage src="그래프/그래프 영역 3/대전_비.png" alt="대전 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/울산.png" alt="울산" />
              <GraphImage src="그래프/그래프 영역 3/울산_비.png" alt="울산 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/세종.png" alt="세종" />
              <GraphImage src="그래프/그래프 영역 3/세종_비.png" alt="세종 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/경기.png" alt="경기" />
              <GraphImage src="그래프/그래프 영역 3/경기_비.png" alt="경기 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/강원.png" alt="강원" />
              <GraphImage src="그래프/그래프 영역 3/강원_비.png" alt="강원 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/충북.png" alt="충북" />
              <GraphImage src="그래프/그래프 영역 3/충북_비.png" alt="충북 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/충남.png" alt="충남" />
              <GraphImage src="그래프/그래프 영역 3/충남_비.png" alt="충남 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/전북.png" alt="전북" />
              <GraphImage src="그래프/그래프 영역 3/전북_비.png" alt="전북 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/전남.png" alt="전남" />
              <GraphImage src="그래프/그래프 영역 3/전남_비.png" alt="전남 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/경북.png" alt="경북" />
              <GraphImage src="그래프/그래프 영역 3/경북_비.png" alt="경북 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/경남.png" alt="경남" />
              <GraphImage src="그래프/그래프 영역 3/경남_비.png" alt="경남 비율" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <GraphImage src="그래프/그래프 영역 3/제주.png" alt="제주" />
              <GraphImage src="그래프/그래프 영역 3/제주_비.png" alt="제주 비율" />
            </div>
          </Graph>
          <TextSection height="180px">
            <p>좌측 그래프는 각 시도의 시군구별 1인 세대 수를, 우측 그래프는 각 시도의 시군구별 1인 세대 비율을 나타내고 있습니다. 그래프는 위에서부터 서울, 부산, 대구, 인천, 광주, 대전, 울산, 세종, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주 순으로 정렬되어 있습니다.

              시도별로 분석한 결과와 마찬가지로, 시군구별로 분석했을 때에도 1인 세대 수와 1인 세대 비율 간의 차이를 확인할 수 있습니다. 전체적으로 1인 세대 수의 차이는 크지만, 1인 세대 비율의 차이는 상대적으로 덜했습니다. 이는 특정 시군구에서 1인 세대의 절대 수치는 많을 수 있지만, 해당 시군구의 전체 세대 수 대비 1인 세대의 비율은 큰 차이가 없음을 의미합니다.
            </p>
          </TextSection>
        </Section>
        <Section>
          <SectionTitle>히트맵 분석</SectionTitle>
          <Graph height="800px">
            <GraphImage src="그래프/히트맵 영역/1.png" alt="히트맵 1" />
            <GraphImage src="그래프/히트맵 영역/2.png" alt="히트맵 2" />
            <GraphImage src="그래프/히트맵 영역/3.png" alt="히트맵 3" />
            <GraphImage src="그래프/히트맵 영역/4.png" alt="히트맵 4" />
          </Graph>
          <TextSection height="150px">
            <p>히트맵 분석 결과, 1인 가구 수와 다양한 데이터 간의 상관관계에서 여러 시사점을 도출할 수 있었습니다. 먼저, 1인 가구 수와 전체 세대 수는 매우 강한 양의 상관관계를 가지지만, 1인 가구 비율과 전체 세대 수는 강한 음의 상관관계를 보입니다. 또한, 1인 가구 비율이 높아질수록 단위 면적당 주택 가격은 줄어드는 약한 음의 상관관계를 가지며, 면적당 대중교통 수도 1인 가구 비율과 약한 음의 상관관계를 나타냅니다. 마지막으로, 1인 가구 비율과 상업시설 수는 약한 양의 상관관계를 보이는 반면, 1인 가구 수와 상업시설 수는 강한 양의 상관관계를 가집니다.
            </p>
          </TextSection>
        </Section>
      </Container>
      <Footer>
        <p>&copy; 2024 SingleNest. All Rights Reserved.</p>
      </Footer>
    </>
  );
};

export default App;
