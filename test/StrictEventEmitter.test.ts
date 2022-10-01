import { StrictEventEmitter } from '../src/StrictEventEmitter'

interface EventsMap {
  ping: (n: number) => void
  pong: (n: number) => void
}

it('restricts on/emit methods to the given events map', () => {
  const callback = jest.fn()
  const emitter = new StrictEventEmitter<EventsMap>()
  emitter.on('ping', callback)
  emitter.emit('ping', 5)

  expect(callback).toBeCalledTimes(1)
  expect(callback).toBeCalledWith(5)

  emitter.removeAllListeners()
})

it('dispatches "once" callback only once', () => {
  const callback = jest.fn()
  const emitter = new StrictEventEmitter<EventsMap>()

  emitter.once('ping', callback)

  emitter.emit('ping', 5)
  emitter.emit('ping', 10)
  emitter.emit('ping', 15)

  expect(callback).toBeCalledTimes(1)
  expect(callback).toBeCalledWith(5)
})

describe('removeAllListeners()', () => {
  it('removes all listeners when called without any arguments', () => {
    const callback = jest.fn()
    const emitter = new StrictEventEmitter<EventsMap>()

    emitter.on('ping', callback)
    emitter.removeAllListeners()

    emitter.emit('ping', 5)
    expect(callback).not.toHaveBeenCalled()
  })

  it('removes all listeners for a specific event', () => {
    const pingListener = jest.fn()
    const pongListener = jest.fn()
    const emitter = new StrictEventEmitter<EventsMap>()

    emitter.on('ping', pingListener)
    emitter.on('pong', pongListener)
    emitter.removeAllListeners('ping')

    emitter.emit('ping', 5)
    expect(pingListener).not.toHaveBeenCalled()

    emitter.emit('pong', 5)
    expect(pongListener).toHaveBeenCalledWith(5)
  })
})
