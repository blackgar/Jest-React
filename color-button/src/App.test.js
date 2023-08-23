import { render, screen, fireEvent } from "@testing-library/react";
import App, { replaceCamelWithSpaces } from "./App";

// 버튼이 처음 텍스트와 색상을 가지고 있는지 확인하고 클릭 했을 때 색상과 텍스트가 변하는지 체크하기.
test("button has correct initial color", () => {
  render(<App />);

  // find an element with a role of button and text of 'Change to blue'
  const colorButton = screen.getByRole("button", { name: "Change to Midnight Blue" });

  // expect the background color to be red
  expect(colorButton).toHaveStyle({ backgroundColor: "MediumVioletRed" });

  // click button
  fireEvent.click(colorButton);

  // expect the background color to be blue
  expect(colorButton).toHaveStyle({ backgroundColor: "MidnightBlue" });

  // expect the button text to be 'Change to red'
  expect(colorButton).toHaveTextContent("Change to Medium Violet Red");
});

// 체크가 안되어 있는 상황에서 버튼은 활성화인지 체크하기.
test('체크가 안되어 있는 상황에서 버튼 활성화 확인하기.', () => {
  render(<App />)

  const colorButton = screen.getByRole('button', { name: 'Change to Midnight Blue' })
  expect(colorButton).not.toBeEnabled()

  const checkbox = screen.getByRole('checkbox')
  expect(checkbox).not.toBeChecked()
})

// 체크가 되는 순간 버튼이 비활성화가 되는지 확인하기.
test('체크가 되는 순간 버튼 비활성화 확인하기', () => {
  render(<App />)
  // 일반적으로 그냥 getByRole('checkbox') 형식으로 작성할 경우 checkbox가 여러개면 구분이 되지 않는 문제가 발생하기 때문에 구체적으로 지정해주는 것이 좋다.(앞서 작성했던 colorButton처럼)
  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' })
  const colorButton = screen.getByRole('button', { name: 'Change to Midnight Blue' })

  fireEvent.click(checkbox)
  expect(checkbox).toBeChecked()
  expect(colorButton).not.toBeEnabled()

  fireEvent.click(checkbox)
  expect(checkbox).not.toBeChecked()
  expect(colorButton).toBeEnabled()
})

test('disabled 체크박스를 체크하면 회색으로 변하고 버튼 클릭 시 활성화 및 색상 변환 여부 체크', () => {
  render(<App />)

  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' })
  const colorButton = screen.getByRole('button', { name: 'Change to Midnight Blue' })

  fireEvent.click(checkbox)
  expect(colorButton).toHaveStyle({ backgroundColor: 'gray' })

  fireEvent.click(checkbox)
  expect(colorButton).toHaveStyle({ backgroundColor: 'MediumVioletRed' })

  fireEvent.click(colorButton)

  fireEvent.click(checkbox)
  expect(colorButton).toHaveStyle({ backgroundColor: 'gray' })

  fireEvent.click(checkbox)
  expect(colorButton).toHaveStyle({ backgroundColor: 'MidnightBlue' })
})

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