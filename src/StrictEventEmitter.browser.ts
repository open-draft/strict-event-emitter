import { EventMapType } from './StrictEventEmitter'

export type ListenerFunction<Data> = (data: Data) => void

export class StrictEventEmitter<EventMap extends EventMapType> {
  #events: Map<keyof EventMap, Set<ListenerFunction<unknown>>>
  #target: EventTarget

  constructor() {
    this.#events = new Map()
    this.#target = new EventTarget()
  }

  private registerEvent<Event extends keyof EventMap>(
    event: Event,
    listener: ListenerFunction<EventMap[Event]>
  ): void {
    const listeners = this.#events.get(event) || new Set()
    listeners.add(listener)
    this.#events.set(event, listeners)
  }

  private unregisterEvent<Event extends keyof EventMap>(
    event: Event,
    listener?: ListenerFunction<EventMap[Event]>
  ): void {
    if (!listener) {
      this.#events.delete(event)
      return
    }

    const listeners = this.#events.get(event)
    listeners.delete(listener)
    this.#events.set(event, listeners)
  }

  private unwrapListener(listener: ListenerFunction<unknown>) {
    return (event: Event) => {
      if (event instanceof MessageEvent<EventMap[Event]>) {
        listener(event.data)
      }
    }
  }

  public emit<Event extends keyof EventMap>(
    event: Event & string,
    data: EventMap[Event]
  ): void {
    this.#target.dispatchEvent(new MessageEvent(event, { data }))
  }

  public on<Event extends keyof EventMap>(
    event: Event & string,
    listener: ListenerFunction<EventMap[Event]>
  ): void {
    this.#target.addEventListener(event, this.unwrapListener(listener))
    this.registerEvent(event, listener)
  }

  public addListener<Event extends keyof EventMap>(
    event: Event & string,
    listener: ListenerFunction<EventMap[Event]>
  ): void {
    this.on(event, listener)
  }

  public prependListener(): void {}

  public prependOnceListener(): void {}

  public once<Event extends keyof EventMap>(
    event: Event & string,
    listener: ListenerFunction<EventMap[Event]>
  ): void {
    this.#target.addEventListener(
      event,
      (message) => {
        this.unwrapListener(listener)(message)
        this.unregisterEvent<Event>(event, listener)
      },
      { once: true }
    )
  }

  public off<Event extends keyof EventMap>(
    event: Event & string,
    listener: ListenerFunction<EventMap[Event]>
  ): void {
    this.#target.removeEventListener(event, listener)
    this.unregisterEvent(event, listener)
  }

  public removeListener<Event extends keyof EventMap>(
    event: Event & string,
    listener: ListenerFunction<EventMap[Event]>
  ): void {
    this.off(event, listener)
  }

  public removeAllListeners(): void {}

  public eventNames(): Array<keyof EventMap> {
    return Array.from(this.#events.keys())
  }

  public listeners(): Array<ListenerFunction<unknown>> {
    return []
  }

  public rawListeners(): void {}

  public listenerCount<Event extends keyof EventMap>(event: Event): void {}
}
