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

it('emits "removeListener" after the listener is removed', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  const removeListenerListener = jest.fn()

  emitter.on('hello', listener)
  emitter.once('removeListener', (...args) => {
    removeListenerListener(...args)
    // "removeListener" is emitted *after* the listener is removed,
    // so by this time there's no "hello" listeners already.
    expect(emitter.listenerCount('hello')).toBe(0)
  })
  emitter.removeListener('hello', listener)

  expect(removeListenerListener).toHaveBeenCalledWith('hello', listener)
  expect(removeListenerListener).toHaveBeenCalledTimes(1)
})
