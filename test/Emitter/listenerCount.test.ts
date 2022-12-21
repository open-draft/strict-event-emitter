import { Emitter } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

it('returns 0 if the emitter has no listeners', () => {
  const emitter = new Emitter<Events>()
  expect(emitter.listenerCount('hello')).toBe(0)
})

it('returns 0 given event name that has no listeners', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('goodbye', listener)
  expect(emitter.listenerCount('hello')).toBe(0)
})

it('returns the number of listeners for the event', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  expect(emitter.listenerCount('hello')).toBe(1)

  emitter.on('hello', listener)
  emitter.on('hello', listener)

  expect(emitter.listenerCount('hello')).toBe(3)
})

it('returns the number of listeners for the event, including once listeners', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.once('hello', listener)
  emitter.once('hello', listener)

  expect(emitter.listenerCount('hello')).toBe(3)
})
