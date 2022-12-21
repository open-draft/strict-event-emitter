import { Emitter } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

it('removes all listeners for the given event', () => {
  const emitter = new Emitter<Events>()
  const helloListener = jest.fn()
  const goodbyeListener = jest.fn()
  emitter.on('hello', helloListener)
  emitter.on('hello', helloListener)
  emitter.removeAllListeners('hello')

  emitter.on('goodbye', goodbyeListener)
  emitter.emit('hello', 'John')
  emitter.emit('goodbye', 'Joseph')

  expect(helloListener).not.toHaveBeenCalled()
  expect(goodbyeListener).toHaveBeenCalledTimes(1)
  expect(goodbyeListener).toHaveBeenCalledWith('Joseph')

  expect(emitter.listenerCount('hello')).toBe(0)
  expect(emitter.listenerCount('goodbye')).toBe(1)
})

it('removes all listeners when no event name was provided', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.on('goodbye', listener)
  emitter.removeAllListeners()

  emitter.emit('hello', 'John')
  emitter.emit('goodbye', 'John')

  expect(listener).not.toHaveBeenCalled()
  expect(emitter.listenerCount('hello')).toBe(0)
  expect(emitter.listenerCount('goodbye')).toBe(0)
})
