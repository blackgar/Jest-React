# React에 Jest 적용해보기 내용 정리

## 기본적인 Jest 구조
```
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // screen은 DOM에 접근할 수 있게 해주는 global object
  const linkElement = screen.getByText(/learn react/i);
  // 이 부분은 단언(Assertion)이라고 한다. 테스트의 성공과 실패를 결정하는 부분으로 볼 수 있다.
  // expect는 global 안의 argument는 예상에 들어맞는지 확인하기 위한 인수. toBeInTheDocument는 matcher라고 부른다. 지금 이 matcher에는 인수가 없지만, 
  expect(linkElement).toBeInTheDocument();
});

```
## Assertion
- expect(element.textContent).toBe('hello')
  - element.textContent가 대상이 되고 toBe라는 Matcher가 있고 여기에 'hello'라는 문구가 들어있어야 한다.
  - 정리하면 요소의 텍스트 켄텐츠에 'hello'라는 문구가 들어있는지를 예측하기 때문에 'hello'가 들어있으면 통과 없으면 실패
- expect(elementArray).toHaveLength(7)
  - toHaveLength는 배열의 요소 길이를 ()안의 인자값 만큼 되는지 체크한다.
- jest-dom
  - src/setupTests.js에서 jest 테스트를 위한 것들을 import 해오면서 jest-dom에서 제공하는 matcher을 사용가능해진다.
  - toBeInTheDocument, toBeVisible, toBeChecked와 같이 DOM에서 볼 수 있고 DOM을 활용한 matcher들의 경우 가상 DOM에 적용을 하는데, 이를 가능하게 해주는게 jest-dom이다.

## Jest 작동 원리와 필요한 이유
- React Testing Library(이하 RTL)은 가상 DOM을 렌더링하고 검색해주고 상호작용하는 테스트들을 도와준다.
- 이 과정에서 Test runner가 필요한데 Jest, Jasmine과 같은 것들이 그것이다.
- Jest를 RTL에서 추천한다.
- npm test는 Jest를 Watch 모드로 실행하는 것이다. 
  - Watch 모드란 마지막 커밋을 기반으로 변경된 파일들을 비교 분석하고 필요한 부분에 대해서만 테스트하는 모드.
  - 만약 모두 다 테스트를 하고 싶다면 a 버튼을 클릭해서 모든 테스트를 수행할 수 있다.
- Jest 테스트 통과와 실패는 어떻게 진행되는가?
  - global test 메서드는 2개의 인수를 가진다. 첫 번째 인수는 테스트에 대한 문자열 설명이고 이를 통해 어떤 테스트가 실패했는지 알려준다. 두 번째는 테스트 함수이다. 이 함수를 실행하여 테스트 실패와 성공을 판단한다. 어떠한 에러가 발생하든 실패를 반환한다. 그렇기 때문에 강제로 Error를 발생시키면 실패가 되고 빈 테스트는 통과가 된다.
  - 

## Jest의 test에 하나의 Assertion이 좋을까? 여러 Assertion이 들어가면 좋을까?
- render과 colorButton을 선언하는 부분이 같은 test 여러개를 선언해서 각각 다른 부분을 확인하려고 할 때 굳이 두개의 test로 분기할 필요가 있을까에 대한 의문에 생길 수 있는데, 이 부분은 본읜 개발 철학이 중요하다.
- 하나의 test에는 하나의 expect만 있어야 한다는 사람도 있고 효율을 중요시 여기는 사람도 있고 다양한 사람들이 있다.
- 그리고 unit test처럼 단일 테스트에 대해서는 하나의 단언문만 사용하고, 기능 테스트 처럼 여러 부분들의 일련의 동작을 확인하기 위해서는 하나의 테스트에 다양한 단언문(expect)이 들어갈 수 있다.
- 아래의 Case에서 알 수 있듯이 하나의 test에 여러 Assertion이 들어가있고 상위 Assertion에서 에러가 발생하면 하위 Assertion은 실행조차 되지 않는 현상이 발생한다. 이로 인해 하나의 테스트에 하나의 Assertion으로 여러 Test를 실행시킬 경우 딱 그 하나의 Case에 대한 오류만 확인할 수 있는 장점이 있는 대신 여러 Test를 다 작성해야 하는 단점이 있다. 하나의 테스트에 여러 Assertion을 작성하는 것은 하나의 테스트만 작성하면 되지만, 하나의 Assertion의 에러로 인해 다른 Assertion에 대한 결과를 확인할 수 없다는 단점이 있다.
```
  ● 버튼이 올바른 색상을 가져야해.

    expect(element).toHaveStyle()

    - Expected

    - backgroundColor: blue;

      19 |
      20 |   // 배경 색상이 파란색으로 변해야 한다.
    > 21 |   expect(colorButton).toHaveStyle({ backgroundColor: 'blue' })
         |                       ^
      22 |   
      23 |   // 버튼의 텍스트가 Change to red로 변경되는지 체크한다.
      24 |   expect(colorButton).toHaveTextContent('Change to red')
```

## getByRole
- 역할에 따른 DOM 가져오기가 가능한 screen 전역 객체의 메서드이다.
- 아래는 역할에 따른 DOM을 가져오려는데 에러가 발생했을 때 현재 접근 가능한 것들에 대해서 알려주는 예시이다.
```
    Here are the accessible roles:

      button:

      Name "Change to blue":
      <button
        style="background-color: red; color: white;"
      />

      --------------------------------------------------
      checkbox:

      Name "":
      <input
        id="enable-button-checkbox"
        type="checkbox"
      />

      --------------------------------------------------
```

## describe
- 테스트를 그룹으로 묶는 방법
- 예시 - 카멜케이스 사이에 공백 넣어주기 라는 큰 describe 안에 각각의 Test 주제들이 보여진다.
```
describe('카멜케이스 사이에 공백 넣어주기', () => {
  test('대문자가 없는 경우', () => {
    expect(replaceCamelWithSpaces('Red')).toBe('Red')
  })
  test('대문자가 하나인 경우', () => {
    expect(replaceCamelWithSpaces('MidnightBlue')).toBe('Midnight Blue')
  })
  test('대문자가 여러개인 경우', () => {
    expect(replaceCamelWithSpaces('MediumVioletRed')).toBe('Medium Violet Red')
  })
})

// 테스트 결과
카멜케이스 사이에 공백 넣어주기
  ✓ 대문자가 없는 경우
  ✓ 대문자가 하나인 경우
  ✓ 대문자가 여러개인 경우 (1 ms)
```

## 언제 Unit Test를 해야 하는가?
- 엣지 케이스들이 많아서 그 각각의 경우를 확인해야 하는 경우
- 기능 테스트가 정말 광범위한 부분을 테스트 하고 있는데 테스트 실패가 발생하여 내부 각각의 함수에 대한 테스트 결과를 확인하고 싶은 경우
- 각 개발 팀마다 원하는 방식이 다를 수 있다.