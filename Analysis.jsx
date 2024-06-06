import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: auto;
  overflow: hidden;
  padding-top: 100px;
`;

const Main = styled.div`
  background: #14213d;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  box-sizing: border-box;
  text-align: center;
`;

const MainImage = styled.img`
  width: 50%;
  height: auto;
`;

const MainContent = styled.div`
  width: 50%;
  padding-left: 20px;
  box-sizing: border-box;
  text-align: left;
`;

const Section = styled.div`
  background: #14213d;
  padding: 40px;
  margin: 20px 0;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 20px;
`;

const GraphContainer = styled.div`
  width: 100%;
  height: 1200px;
  background: #FFFFFF;
  color: #e5e5e5;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;
  overflow: scroll;

`;

const GraphContainer3 = styled.div`
  width: 100%;
  height: 1200px;
  background: #FFFFFF;
  color: #e5e5e5;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;
  overflow: scroll;
`;

const GraphImage = styled.img`
  width: 48%;
  margin: 1%;
  border-radius: 10px;
`;

const TextSection = styled.div`
  width: 100%;
  height: 250px;
  background: #e5e5e5;
  color: #2b2d42;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
`;

const Header = styled.header`
  color: #FFFFFF;
  padding: 10px 40px;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-sizing: border-box;
  background: none;
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

const Footer = styled.footer`
  text-align: center;
  padding: 20px;
  background: #2b2d42;
  color: #fff;
`;

const App = () => {
  return (
    <div>

      <Container>
        <Main>
          <MainContent>
            <h2>데이터 분석 및 시각화</h2>
            <p>여기에서는 1인 가구 수, 전체 가구 수, 지역별 1인 가구 비율과 주거 환경 요소들의 상관관계를 분석하고 그 결과를 시각화하여 보여줍니다. 각 요소가 1인 가구 주거 선택에 미치는 영향을 명확하게 이해할 수 있도록 도와줍니다.
              <br />어쩌고저쩌고....
            </p>
          </MainContent>
        </Main>

        <Section>
          <SectionTitle>세대 구성 형태의 변화 분석</SectionTitle>
          <GraphContainer>
            <GraphImage src="그래프/그래프 영역 1/1. 연도별 세대수변화.png" alt="Image 1" />
            <GraphImage src="그래프/그래프 영역 1/2. 세대 구성 형태 변화.png" alt="Image 2" />
            <GraphImage src="그래프/그래프 영역 1/3. 2014년 1월 세대 구성 형태.png" alt="Image 3" />
            <GraphImage src="그래프/그래프 영역 1/4. 2024년 1월 세대 구성 형태.png" alt="Image 4" />
          </GraphContainer>
          <TextSection>
            <p> 지난 10년간 대한민국의 세대 수와 인구 변화를 분석한 결과, 세대 수는 크게 증가한 반면, 인구 증가율은 상대적으로 낮은 수준을 유지하고 있음을 확인할 수 있습니다.

              2014년 1월부터 2023년 12월까지 대한민국의 세대 수는 총 3,447,967세대 증가하여, 2014년 1월의 20,466,884세대에서 2023년 12월의 23,914,851세대로 늘어났습니다. 이는 약 16.8%의 증가율을 나타냅니다. 반면, 같은 기간 동안 전국 인구수는 169,161명 증가하여 2014년 1월의 51,156,168명에서 2023년 12월의 51,325,329명으로 소폭 증가하였으며, 이는 약 0.33%의 증가율입니다. 세대 수 증가율에 비해 인구 증가율은 매우 낮은 수치를 보이고 있습니다.
              
              세대 유형별로 살펴보면, 지난 10년 동안 4인 이상 세대 수는 감소하는 반면, 1인 세대와 2인 세대 수는 지속적으로 증가하는 추세를 보였습니다. 특히, 1인 세대는 2014년 1월의 6,878,013세대에서 2024년 1월의 9,943,426세대로 3,065,413세대가 증가하였습니다. 이는 1인 세대가 전체 세대 중 차지하는 비율이 33.6%에서 41.6%로 8% 증가한 것을 의미합니다.
            </p>
          </TextSection>
        </Section>

        <Section>
          <SectionTitle>시도별 1인 세대 수 분석</SectionTitle>
          <GraphContainer>
            <GraphImage src="그래프/그래프 영역 2/5. 시도별 1인 세대 수.png" alt="Image 5" />
            <GraphImage src="그래프/그래프 영역 2/6. 시도별 1인 세대 비율.png" alt="Image 6" />
            <GraphImage src="그래프/그래프 영역 2/7. 시도별 1인 세대 수_원.png" alt="Image 7" />
            <GraphImage src="그래프/그래프 영역 2/8. 시도별 1인 세대 비율_원.png" alt="Image 8" />
          </GraphContainer>
          <TextSection>
            <p>2023년 12월 기준으로 1인 세대 수가 가장 많은 시도는 경기도와 서울특별시입니다. 그러나 1인 세대 비율로 분석한 결과, 모든 시도의 비율이 크게 차이나지 않고 비슷한 수준을 유지하고 있음을 확인할 수 있습니다.

              1인 세대 비율이 가장 높은 세 지역은 전라남도(47.1%), 경상북도(45.6%), 강원특별자치도(45.2%)로 나타났습니다. 이는 해당 지역들이 전체 세대 중에서 1인 세대가 차지하는 비율이 높다는 것을 의미합니다.
              
              총 17개의 시도 중 1인 세대 수가 가장 많았던 경기도는 37.3%의 비율을 기록하여, 1인 세대 비율로는 15번째에 위치했습니다. 이는 경기도의 총 세대 수가 많기 때문에 상대적으로 1인 세대 비율이 낮게 나타난 결과로 해석할 수 있습니다.
            </p>
          </TextSection>
        </Section>

        <Section>
          <SectionTitle>시군구별 1인 세대 수 분석</SectionTitle>
          <GraphContainer3>
            <GraphImage src="그래프/그래프 영역 3/서울.png" alt="그래프 1" />
            <GraphImage src="그래프/그래프 영역 3/서울_비.png" alt="그래프 1 추가" />
            <GraphImage src="그래프/그래프 영역 3/부산.png" alt="그래프 2" />
            <GraphImage src="그래프/그래프 영역 3/부산_비.png" alt="그래프 2 추가" />
            <GraphImage src="그래프/그래프 영역 3/대구.png" alt="그래프 3" />
            <GraphImage src="그래프/그래프 영역 3/대구_비.png" alt="그래프 3 추가" />
            <GraphImage src="그래프/그래프 영역 3/인천.png" alt="그래프 4" />
            <GraphImage src="그래프/그래프 영역 3/인천_비.png" alt="그래프 4 추가" />
            <GraphImage src="그래프/그래프 영역 3/광주.png" alt="그래프 5" />
            <GraphImage src="그래프/그래프 영역 3/광주_비.png" alt="그래프 5 추가" />
            <GraphImage src="그래프/그래프 영역 3/대전.png" alt="그래프 6" />
            <GraphImage src="그래프/그래프 영역 3/대전_비.png" alt="그래프 6 추가" />
            <GraphImage src="그래프/그래프 영역 3/울산.png" alt="그래프 7" />
            <GraphImage src="그래프/그래프 영역 3/울산_비.png" alt="그래프 7 추가" />
            <GraphImage src="그래프/그래프 영역 3/세종.png" alt="그래프 8" />
            <GraphImage src="그래프/그래프 영역 3/세종_비.png" alt="그래프 8 추가" />
            <GraphImage src="그래프/그래프 영역 3/경기.png" alt="그래프 9" />
            <GraphImage src="그래프/그래프 영역 3/경기_비.png" alt="그래프 9 추가" />
            <GraphImage src="그래프/그래프 영역 3/강원.png" alt="그래프 10" />
            <GraphImage src="그래프/그래프 영역 3/강원_비.png" alt="그래프 10 추가" />
            <GraphImage src="그래프/그래프 영역 3/충북.png" alt="그래프 11" />
            <GraphImage src="그래프/그래프 영역 3/충북_비.png" alt="그래프 11 추가" />
            <GraphImage src="그래프/그래프 영역 3/충남.png" alt="그래프 12" />
            <GraphImage src="그래프/그래프 영역 3/충남_비.png" alt="그래프 12 추가" />
            <GraphImage src="그래프/그래프 영역 3/전북.png" alt="그래프 13" />
            <GraphImage src="그래프/그래프 영역 3/전북_비.png" alt="그래프 13 추가" />
            <GraphImage src="그래프/그래프 영역 3/전남.png" alt="그래프 14" />
            <GraphImage src="그래프/그래프 영역 3/전남_비.png" alt="그래프 14 추가" />
            <GraphImage src="그래프/그래프 영역 3/경북.png" alt="그래프 15" />
            <GraphImage src="그래프/그래프 영역 3/경북_비.png" alt="그래프 15 추가" />
            <GraphImage src="그래프/그래프 영역 3/경남.png" alt="그래프 16" />
            <GraphImage src="그래프/그래프 영역 3/경남_비.png" alt="그래프 16 추가" />
            <GraphImage src="그래프/그래프 영역 3/제주.png" alt="그래프 17" />
            <GraphImage src="그래프/그래프 영역 3/제주_비.png" alt="그래프 17 추가" />
          </GraphContainer3>
          <TextSection>
            <p>좌측 그래프는 각 시도의 시군구별 1인 세대 수를, 우측 그래프는 각 시도의 시군구별 1인 세대 비율을 나타내고 있습니다. 그래프는 위에서부터 서울, 부산, 대구, 인천, 광주, 대전, 울산, 세종, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주 순으로 정렬되어 있습니다.

              시도별로 분석한 결과와 마찬가지로, 시군구별로 분석했을 때에도 1인 세대 수와 1인 세대 비율 간의 차이를 확인할 수 있습니다. 전체적으로 1인 세대 수의 차이는 크지만, 1인 세대 비율의 차이는 상대적으로 덜했습니다. 이는 특정 시군구에서 1인 세대의 절대 수치는 많을 수 있지만, 해당 시군구의 전체 세대 수 대비 1인 세대의 비율은 큰 차이가 없음을 의미합니다. 
            </p>
          </TextSection>
        </Section>

        <Section>
          <SectionTitle>히트맵 분석</SectionTitle>
          <GraphContainer>
            <GraphImage src="그래프/그래프 영역 4/히트맵.png" alt="Image" />
          </GraphContainer>
          <TextSection>
            <p>히트맵 분석 결과, 1인 가구 수와 다양한 상권 데이터 및 주거비용 간의 상관관계에 대해 여러 중요한 시사점을 도출할 수 있었습니다.

              우선, 1인 가구 수는 숙박을 제외한 모든 상권 데이터와 양의 상관관계를 보였습니다. 이는 1인 가구가 많은 지역일수록 상업 활동이 활발하다는 것을 의미합니다. 
              
              특히, 이러한 지역에서는 주거비용 또한 함께 상승하는 경향을 나타내었습니다. 
              
              1인 가구의 증가가 상권 활성화와 주거비용 상승에 밀접한 연관이 있음을 보여줍니다.
              
              또한, 단순히 1인 가구가 많은 지역은 총인구수와 전체 세대수가 더 많았습니다. 
              
              이는 1인 가구가 특정 지역에 집중되어 있지 않고, 넓은 범위에 분포되어 있음을 시사합니다. 
              
              그러나 1인 가구가 거주하는 비율 면에서는 감소하는 경향이 나타났습니다. 
              
              이는 특정 지역 내에서 1인 가구 비율이 상대적으로 낮아지고 있음을 의미합니다.
              
              더불어, 1인 세대가 거주하는 비율이 높은 지역은 주거비용이 확연히 떨어지는 경향을 보였습니다. 
              
              이는 1인 가구가 주로 주거비용이 낮은 지역에 거주하는 경향이 있음을 나타냅니다. 또한, 이러한 지역에서는 전체적인 상권도 함께 감소하는 경향을 보였습니다. 이는 1인 가구가 많은 지역에서는 상권이 다소 축소될 수 있음을 의미합니다.
              
              마지막으로, 성별 간의 유의미한 차이는 보이지 않았습니다. 
              
              이는 상권 형성이나 주거비용에 있어서 성별이 큰 영향을 미치지 않는다는 것을 시사합니다.
              
              종합적으로, 1인 가구의 증가가 상권과 주거비용에 다양한 영향을 미치고 있음을 확인할 수 있었습니다. 
              
              1인 가구가 증가하는 지역은 상업 활동이 활발하지만, 주거비용이 상승하는 경향이 있습니다. 반면, 1인 가구 비율이 높은 지역은 주거비용이 낮고 상권도 축소되는 경향이 나타났습니다.
            </p>
          </TextSection>
        </Section>
      </Container>

      <Footer>
        <p>&copy; 2024 SingleNest. All Rights Reserved.</p>
      </Footer>
    </div>
  );
};

export default App;