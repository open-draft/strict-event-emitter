import { Emitter, MemoryLeakError } from '../../src'

type Events = {
  hello: [name: string]
  goodbye: [name: string]
}

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.restoreAllMocks()
})

it('has 10 as the default max listeners limit', () => {
  const emitter = new Emitter<Events>()
  expect(Emitter.defaultMaxListeners).toBe(10)
  expect(emitter.getMaxListeners()).toBe(10)
})

it('warns when the max listeners limit is exceeded', () => {
  const emitter = new Emitter<Events>()
  const listener = jest.fn()
  emitter.setMaxListeners(1)
  emitter.on('hello', listener)
  emitter.on('hello', listener)
  emitter.emit('hello', 'John')

  // Must print the potential memory leak warning.
  const warning: MemoryLeakError = (console.warn as jest.Mock).mock.calls.find(
    (call) => {
      return call.find((arg) => {
        if (arg.name === 'MaxListenersExceededWarning') {
          return arg
        }
      })
    }
  )?.[0]

  expect(warning).toBeInstanceOf(MemoryLeakError)
  expect(warning.type).toBe('hello')
  expect(warning.count).toBe(2)
  expect(warning.emitter).toEqual(emitter)

  // Must still call the listeners.
  expect(listener).toHaveBeenCalledTimes(2)
  expect(listener).toHaveBeenNthCalledWith(1, 'John')
  expect(listener).toHaveBeenNthCalledWith(2, 'John')
  expect(emitter.listenerCount('hello')).toBe(2)
})
