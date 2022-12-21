import { MemoryLeakError } from './MemoryLeakError'

export type EventMap = {
  [eventName: string]: Array<unknown>
}

export type InternalEventNames = 'newListener' | 'removeListener'

export type InternalListener<Events extends EventMap> = Listener<
  [eventName: keyof Events, listener: Listener<Array<unknown>>]
>

export type Listener<Data extends Array<unknown>> = (...data: Data) => void

/**
 * Node.js-compatible implementation of `EventEmitter`.
 *
 * @example
 * const emitter = new Emitter<{ hello: [string] }>()
 * emitter.on('hello', (name) => console.log(name))
 * emitter.emit('hello', 'John')
 */
export class Emitter<Events extends EventMap> {
  #events: Map<keyof Events, Array<Listener<any>>>
  #maxListeners: number
  #hasWarnedAboutPotentialMemortyLeak: boolean

  static defaultMaxListeners = 10

  static listenerCount<Events extends EventMap>(
    emitter: Emitter<EventMap>,
    eventName: keyof Events
  ): number {
    return emitter.listenerCount<any>(eventName)
  }

  constructor() {
    this.#events = new Map()
    this.#maxListeners = Emitter.defaultMaxListeners
    this.#hasWarnedAboutPotentialMemortyLeak = false
  }

  #getListeners<EventName extends keyof Events>(
    eventName: EventName
  ): Array<Listener<Array<unknown>>> {
    return this.#events.get(eventName) || []
  }

  #removeListener<EventName extends keyof Events>(
    listeners: Array<Listener<Events[EventName]>>,
    listener: Listener<Events[EventName]>
  ): Array<Listener<Events[EventName]>> {
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }

    return []
  }

  #wrapOnceListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): Listener<Events[EventName]> {
    const onceListener = (...data: Events[EventName]) => {
      this.removeListener(eventName, onceListener)
      listener.apply(this, data)
    }

    return onceListener
  }

  #internalEmit(
    internalEventName: InternalEventNames,
    eventName: keyof Events,
    listener: Listener<Array<unknown>>
  ): void {
    this.emit(
      internalEventName,
      // Anything to make TypeScript happy.
      ...([eventName, listener] as Events['newListener'] &
        Events['removeListener'])
    )
  }

  public setMaxListeners(maxListeners: number): this {
    this.#maxListeners = maxListeners
    return this
  }

  /**
   * Returns the current max listener value for the `Emitter` which is
   * either set by `emitter.setMaxListeners(n)` or defaults to
   * `Emitteer.defaultMaxListeners`.
   */
  public getMaxListeners(): number {
    return this.#maxListeners
  }

  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   * The values in the array will be strings or Symbols.
   */
  public eventNames(): Array<keyof Events> {
    return Array.from(this.#events.keys())
  }

  /**
   * Synchronously calls each of the listeners registered for the event named `eventName`,
   * in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event has listeners, `false` otherwise.
   *
   * @example
   * const emitter = new Emitter<{ hello: [string] }>()
   * emitter.emit('hello', 'John')
   */
  public emit<EventName extends keyof Events>(
    eventName: EventName,
    ...data: Events[EventName]
  ): boolean {
    const listeners = this.#getListeners(eventName)
    listeners.forEach((listener) => {
      listener.apply(this, data)
    })

    return listeners.length > 0
  }

  public addListener(
    eventName: InternalEventNames,
    listener: InternalListener<Events>
  ): this
  public addListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this
  public addListener(
    eventName: InternalEventNames | keyof Events,
    listener: InternalListener<Events> | Listener<Events[any]>
  ): this {
    // Emit the `newListener` event before adding the listener.
    this.#internalEmit('newListener', eventName, listener)

    const nextListeners = this.#getListeners(eventName).concat(listener)
    this.#events.set(eventName, nextListeners)

    if (
      this.listenerCount(eventName) > this.#maxListeners &&
      !this.#hasWarnedAboutPotentialMemortyLeak
    ) {
      this.#hasWarnedAboutPotentialMemortyLeak = true

      const memoryLeakWarning = new MemoryLeakError(
        this,
        eventName,
        this.listenerCount(eventName)
      )
      console.warn(memoryLeakWarning)
    }

    return this
  }

  public on(
    eventName: InternalEventNames,
    listener: InternalListener<Events>
  ): this
  public on<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this
  public on<EventName extends keyof Events>(
    eventName: 'removeListener' | EventName,
    listener: Listener<any>
  ): this {
    return this.addListener(eventName, listener)
  }

  public once(
    eventName: InternalEventNames,
    listener: InternalListener<Events>
  ): this
  public once<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this
  public once<EventName extends keyof Events>(
    eventName: InternalEventNames | EventName,
    listener: Listener<any>
  ): this {
    return this.addListener(
      eventName,
      this.#wrapOnceListener(eventName, listener)
    )
  }

  public prependListener(
    eventName: InternalEventNames,
    listener: InternalListener<Events>
  ): this
  public prependListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this
  public prependListener(
    eventName: InternalEventNames | keyof Events,
    listener: Listener<any>
  ): this {
    const listeners = this.#getListeners(eventName)

    if (listeners.length > 0) {
      const nextListeners = [listener].concat(listeners)
      this.#events.set(eventName, nextListeners)
    } else {
      this.#events.set(eventName, listeners.concat(listener))
    }

    return this
  }

  public prependOnceListener(
    eventName: InternalEventNames,
    listener: InternalListener<Events>
  ): this
  public prependOnceListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this
  public prependOnceListener(
    eventName: InternalEventNames | keyof Events,
    listener: Listener<any>
  ): this {
    return this.prependListener(
      eventName,
      this.#wrapOnceListener(eventName, listener)
    )
  }

  public removeListener(
    eventName: InternalEventNames,
    listener: InternalListener<Events>
  ): this
  public removeListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this
  public removeListener(
    eventName: InternalEventNames | keyof Events,
    listener: Listener<any>
  ): this {
    const listeners = this.#getListeners(eventName)

    if (listeners.length > 0) {
      this.#removeListener(listeners, listener)
      this.#events.set(eventName, listeners)

      // Emit the `removeListener` event after removing the listener.
      this.#internalEmit('removeListener', eventName, listener)
    }

    return this
  }

  public off(
    eventName: InternalEventNames,
    listener: InternalListener<Events>
  ): this
  public off<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this
  /**
   * Alias for `emitter.removeListener()`.
   *
   * @example
   * emitter.off('hello', listener)
   */
  public off(
    eventName: InternalEventNames | keyof Events,
    listener: Listener<any>
  ): this {
    return this.removeListener(eventName, listener)
  }

  public removeAllListeners(eventName?: InternalEventNames): this
  public removeAllListeners<EventName extends keyof Events>(
    eventName?: EventName
  ): this
  public removeAllListeners(
    eventName?: InternalEventNames | keyof Events
  ): this {
    if (eventName) {
      this.#events.delete(eventName)
    } else {
      this.#events.clear()
    }

    return this
  }

  public listeners(eventName: InternalEventNames): Array<Listener<any>>
  public listeners<EventName extends keyof Events>(
    eventName: EventName
  ): Array<Listener<Events[EventName]>>
  /**
   * Returns a copy of the array of listeners for the event named `eventName`.
   */
  public listeners(eventName: InternalEventNames | keyof Events) {
    return Array.from(this.#getListeners(eventName))
  }

  public listenerCount(eventName: InternalEventNames): number
  public listenerCount<EventName extends keyof Events>(
    eventName: EventName
  ): number
  /**
   * Returns the number of listeners listening to the event named `eventName`.
   */
  public listenerCount(eventName: InternalEventNames | keyof Events): number {
    return this.#getListeners(eventName).length
  }

  public rawListeners<EventName extends keyof Events>(
    eventName: EventName
  ): Array<Listener<Events[EventName]>> {
    return this.listeners(eventName)
  }
}
