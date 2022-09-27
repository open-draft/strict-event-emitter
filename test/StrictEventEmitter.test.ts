import { StrictEventEmitter } from '../src/StrictEventEmitter'

interface EventsMap {
  ping: (n: number) => void
  pong: (n: number) => void
}

test('restricts on/emit methods to the given events map', () => {
  const callback = jest.fn()
  const emitter = new StrictEventEmitter<EventsMap>()
  emitter.on('ping', callback)
  emitter.emit('ping', 5)

  expect(callback).toBeCalledTimes(1)
  expect(callback).toBeCalledWith(5)

  emitter.removeAllListeners()
})

test('dispatches "once" callback only once', () => {
  const callback = jest.fn()
  const emitter = new StrictEventEmitter<EventsMap>()

  emitter.once('ping', callback)

  emitter.emit('ping', 5)
  emitter.emit('ping', 10)
  emitter.emit('ping', 15)

  expect(callback).toBeCalledTimes(1)
  expect(callback).toBeCalledWith(5)
})
