import { StrictEventEmitter } from '../src'

type EventMap = {
  greet(username: string): void
  ping(): void
}

const emitter = new StrictEventEmitter<EventMap>()

/**
 * Emit.
 */
emitter.emit('greet', 'John')

// @ts-expect-error Missing the "username" argument.
emitter.emit('greet')

emitter.emit(
  'greet',
  'John',
  //@ts-expect-error Unknown extra argument.
  2
)

// @ts-expect-error Unknown event "foo".
emitter.emit('foo')

/**
 * Listeners.
 */
const listeners = emitter.listeners('greet')

emitter.listeners(
  // @ts-expect-error Unknown event "foo".
  'foo'
)

listeners.forEach((listener) => {
  listener(
    // @ts-expect-error Expected "string" as the "username" argument.
    2
  )
})

/**
 * Event names.
 */
emitter.eventNames()[0] === 'greet'
emitter.eventNames()[1] === 'ping'

// @ts-expect-error Unknown event name "foo".
emitter.eventNames()[2] === 'foo'
