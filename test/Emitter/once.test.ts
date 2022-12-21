import { Emitter } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

it('is called only once for the matching event', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.once('hello', listener)
  emitter.emit('hello', 'John')
  emitter.emit('hello', 'Joseph')

  expect(listener).toHaveBeenCalledTimes(1)
  expect(listener).toHaveBeenCalledWith('John')

  expect(emitter.listenerCount('hello')).toBe(0)
})

it('can have multiple once listeners for different events', () => {
  const emitter = new Emitter<Events>()
  const helloListener = jest.fn()
  const goodbyeListener = jest.fn()
  emitter.once('hello', helloListener)
  emitter.once('goodbye', goodbyeListener)
  emitter.emit('hello', 'John')
  emitter.emit('goodbye', 'Joseph')

  expect(helloListener).toHaveBeenCalledTimes(1)
  expect(helloListener).toHaveBeenCalledWith('John')

  expect(goodbyeListener).toHaveBeenCalledTimes(1)
  expect(goodbyeListener).toHaveBeenCalledWith('Joseph')

  expect(emitter.listenerCount('hello')).toBe(0)
  expect(emitter.listenerCount('goodbye')).toBe(0)
})
