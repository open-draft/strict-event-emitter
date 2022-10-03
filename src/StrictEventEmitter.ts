import { EventEmitter } from 'events'

export type EventMapType = Record<string | symbol | number, any>

export class StrictEventEmitter<
  EventMap extends EventMapType
> extends EventEmitter {
  constructor() {
    super()
  }

  on<Event extends keyof EventMap>(event: Event, listener: EventMap[Event]) {
    return super.on(event.toString(), listener)
  }

  once<Event extends keyof EventMap>(event: Event, listener: EventMap[Event]) {
    return super.once(event.toString(), listener)
  }

  off<Event extends keyof EventMap>(event: Event, listener: EventMap[Event]) {
    return super.off(event.toString(), listener)
  }

  emit<Event extends keyof EventMap>(
    event: Event,
    ...data: Parameters<EventMap[Event]>
  ) {
    return super.emit(event.toString(), ...data)
  }

  addListener<Event extends keyof EventMap>(
    event: Event,
    listener: EventMap[Event]
  ) {
    return super.addListener(event.toString(), listener)
  }

  prependListener<Event extends keyof EventMap>(
    event: Event,
    listener: EventMap[Event]
  ): this {
    return super.prependListener(event.toString(), listener)
  }

  prependOnceListener<Event extends keyof EventMap>(
    event: Event,
    listener: EventMap[Event]
  ): this {
    return super.prependOnceListener(event.toString(), listener)
  }

  removeListener<Event extends keyof EventMap>(
    event: Event,
    listener: EventMap[Event]
  ) {
    return super.removeListener(event.toString(), listener)
  }

  removeAllListeners<Event extends keyof EventMap>(event?: Event) {
    if (event) {
      return super.removeAllListeners(event.toString())
    }

    return super.removeAllListeners()
  }

  eventNames<Event extends keyof EventMap>(): Event[] {
    return super.eventNames() as Event[]
  }

  listeners<Event extends keyof EventMap>(
    event: Event
  ): Array<EventMap[Event]> {
    return super.listeners(event.toString()) as Array<EventMap[Event]>
  }

  rawListeners<Event extends keyof EventMap>(
    event: Event
  ): Array<EventMap[Event]> {
    return super.rawListeners(event.toString()) as Array<EventMap[Event]>
  }

  listenerCount<Event extends keyof EventMap>(event: Event): number {
    return super.listenerCount(event.toString())
  }
}
