import { StrictEventTarget, StrictMessageEvent } from '../src'

interface Events {
  hello: string
}

it('invokes related listeners upon a dispatched event', () => {
  const target = new StrictEventTarget<Events>()
  const listener = jest.fn()

  target.addEventListener('hello', listener)
  const event = new StrictMessageEvent('hello', { data: 'world' })
  target.dispatchEvent(event)

  expect(listener).toHaveBeenCalledWith(event)
})
