import { Emitter } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

it('prepends a listener', () => {
  const emitter = new Emitter<Events>()
  const firstListener = jest.fn(() => Date.now())
  const prependedListener = jest.fn(() => Date.now())

  emitter.on('hello', firstListener)
  emitter.prependListener('hello', prependedListener)
  emitter.emit('hello', 'John')

  expect(prependedListener).toHaveBeenCalledBefore(firstListener)

  expect(prependedListener).toHaveBeenCalledTimes(1)
  expect(prependedListener).toHaveBeenCalledWith('John')

  expect(firstListener).toHaveBeenCalledTimes(1)
  expect(firstListener).toHaveBeenCalledWith('John')
})
