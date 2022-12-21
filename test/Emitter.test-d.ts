import { Emitter } from '../src/Emitter'

const emitter = new Emitter<{ hello: [string]; goodbye: [string] }>()

/**
 * Emitting events.
 */
emitter.emit('hello', 'John')
emitter.emit('goodbye', 'John')
emitter.emit(
  // @ts-expect-error Invalid event name.
  'unknown',
  'John'
)
emitter.emit(
  'hello',
  // @ts-expect-error Invalid data type.
  2
)
emitter.emit(
  // @ts-expect-error Cannot emit internal events.
  'newListener',
  'hello'
)
emitter.emit(
  // @ts-expect-error Cannot emit internal events.
  'removeListener',
  'hello'
)

/**
 * Listening to events.
 */
emitter.once('newListener', (event, listener) => {
  event.toUpperCase()
  listener.name
})
emitter.once('removeListener', (event, listener) => {
  event.toUpperCase()
  listener.name.toUpperCase()
})
emitter.on('removeListener', (event, listener) => {
  event.toUpperCase()
  listener.name.toUpperCase()
})

emitter.on('hello', (name) => name.toUpperCase())
emitter.on('goodbye', (name) => name.toUpperCase())
emitter.on(
  // @ts-expect-error Invalid event name.
  'unknown',
  () => {}
)

emitter.once('hello', (name) => name.toUpperCase())
emitter.once('goodbye', (name) => name.toUpperCase())
emitter.once(
  // @ts-expect-error Invalid event name.
  'unknown',
  () => {}
)

emitter.addListener('hello', (name) => name.toUpperCase())
emitter.addListener('goodbye', (name) => name.toUpperCase())
emitter.addListener(
  // @ts-expect-error Invalid event name.
  'unknown',
  () => {}
)

/**
 * Removing listeners.
 */
emitter.removeListener('hello', () => {})
emitter.removeListener('goodbye', () => {})
emitter.removeListener(
  // @ts-expect-error Invalid event name.
  'unknown',
  () => {}
)

emitter.off('hello', () => {})
emitter.off('goodbye', () => {})
emitter.off(
  // @ts-expect-error Invalid event name.
  'unknown',
  () => {}
)

emitter.removeAllListeners('hello')
emitter.removeAllListeners('goodbye')
emitter.removeAllListeners()
emitter.removeAllListeners(
  // @ts-expect-error Invalid event name.
  'unknown'
)
