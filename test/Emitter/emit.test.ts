import { Emitter } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

it('calls a single listener', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.emit('hello', 'John')

  expect(listener).toHaveBeenCalledTimes(1)
  expect(listener).toHaveBeenCalledWith('John')
})

it('calls a single once listener', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.once('hello', listener)
  emitter.emit('hello', 'John')

  expect(listener).toHaveBeenCalledTimes(1)
  expect(listener).toHaveBeenCalledWith('John')
})

it('calls all listeners for the same event', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.on('hello', listener)
  emitter.on('hello', listener)
  emitter.emit('hello', 'John')

  expect(listener).toHaveBeenCalledTimes(3)
  expect(listener).toHaveBeenCalledWith('John')
})

it('calls all listeners for the same event, including once listeners', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.once('hello', listener)
  emitter.emit('hello', 'John')

  expect(listener).toHaveBeenCalledTimes(2)
  expect(listener).toHaveBeenCalledWith('John')
})
