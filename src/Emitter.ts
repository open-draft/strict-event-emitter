import { MemoryLeakError } from './MemoryLeakError'

export type EventMap = {
  [eventName: string]: Array<unknown>
}

export type Listener<Data extends Array<unknown>> = (...data: Data) => void

/**
 * Node.js-compatible implementation of `EventEmitter`.
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
  ): Array<Listener<Events[EventName]>> {
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

  public setMaxListeners(maxListeners: number): this {
    this.#maxListeners = maxListeners
    return this
  }

  public getMaxListeners(): number {
    return this.#maxListeners
  }

  public eventNames(): Array<keyof Events> {
    return Array.from(this.#events.keys())
  }

  /**
   * Synchronously calls each of the listeners registered for the event named `eventName`,
   * in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event has listeners, `false` otherwise.
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

  public addListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this {
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

  public on<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this {
    return this.addListener(eventName, listener)
  }

  public once<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this {
    return this.addListener(
      eventName,
      this.#wrapOnceListener(eventName, listener)
    )
  }

  public prependListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
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

  public prependOnceListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this {
    return this.prependListener(
      eventName,
      this.#wrapOnceListener(eventName, listener)
    )
  }

  public removeListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this {
    const listeners = this.#getListeners(eventName)

    if (listeners.length > 0) {
      this.#removeListener(listeners, listener)
      this.#events.set(eventName, listeners)
    }

    return this
  }

  public off<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): this {
    return this.removeListener(eventName, listener)
  }

  public removeAllListeners<EventName extends keyof Events>(
    eventName?: EventName
  ): this {
    if (eventName) {
      this.#events.delete(eventName)
    } else {
      this.#events.clear()
    }

    return this
  }

  public listeners<EventName extends keyof Events>(
    eventName: EventName
  ): Array<Listener<Events[EventName]>> {
    return Array.from(this.#getListeners(eventName))
  }

  public listenerCount<EventName extends keyof Events>(
    eventName: EventName
  ): number {
    return this.#getListeners(eventName).length
  }

  public rawListeners<EventName extends keyof Events>(
    eventName: EventName
  ): Array<Listener<Events[EventName]>> {
    return this.listeners(eventName)
  }
}
