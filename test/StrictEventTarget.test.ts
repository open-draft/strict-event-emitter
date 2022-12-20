import { StrictEventTarget, StrictMessageEvent } from '../src'

interface Events {
  hello: string
}

it('invokes related listeners upon a dispatched event', () => {
  const target = new StrictEventTarget<Events>()
  const listener = jest.fn()

  target.addEventListener('hello', listener)
  target.dispatchEvent(new StrictMessageEvent('hello', { data: 'world' }))

  expect(listener).toHaveBeenCalledWith(
    new MessageEvent('hello', { data: 'world' })
  )
})
