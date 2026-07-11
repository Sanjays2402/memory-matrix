import { expect, test } from 'vitest'

test('test harness provides DOM matchers', () => {
  const button = document.createElement('button')
  button.textContent = 'Play'
  document.body.append(button)

  expect(button).toBeInTheDocument()
  expect(button).toHaveTextContent('Play')
})
