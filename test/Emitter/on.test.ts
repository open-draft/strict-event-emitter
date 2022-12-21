import { Emitter } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

it('called for the matching event', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.emit('hello', 'John')

  expect(listener).toHaveBeenCalledTimes(1)
  expect(listener).toHaveBeenCalledWith('John')
})

it('can be called multiple times for multiple matching events', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.on('hello', listener)
  emitter.emit('hello', 'John')
  emitter.emit('hello', 'Joseph')

  expect(listener).toHaveBeenCalledTimes(2)
  expect(listener).toHaveBeenNthCalledWith(1, 'John')
  expect(listener).toHaveBeenNthCalledWith(2, 'Joseph')
})
