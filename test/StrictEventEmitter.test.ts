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
