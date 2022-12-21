import { Emitter } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

it('removes a single listener', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.removeListener('hello', listener)
  emitter.emit('hello', 'John')

  expect(listener).not.toHaveBeenCalled()
  expect(emitter.listenerCount('hello')).toBe(0)
})

it('removes a single listener, but not others', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.on('hello', listener)
  emitter.removeListener('hello', listener)
  emitter.emit('hello', 'John')

  expect(listener).toHaveBeenCalledTimes(1)
  expect(emitter.listenerCount('hello')).toBe(1)
})
