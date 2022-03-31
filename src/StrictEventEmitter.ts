import { EventEmitter } from 'events'

export class StrictEventEmitter<
  EventMap extends Record<string | symbol, any>
> extends EventEmitter {
  constructor() {
    super()
  }

  on<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
    return super.on(event.toString(), listener)
  }

  once<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
    return super.on(event.toString(), listener)
  }

  off<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
    return super.off(event.toString(), listener)
  }

  emit<K extends keyof EventMap>(event: K, ...data: Parameters<EventMap[K]>) {
    return super.emit(event.toString(), ...data)
  }

  addListener<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
    return super.addListener(event.toString(), listener)
  }

  removeListener<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
    return super.removeListener(event.toString(), listener)
  }

  // @ts-ignore Cannot cast a narrower return type.
  eventNames(): Array<keyof EventMap> {
    return super.eventNames()
  }

  listeners<K extends keyof EventMap>(event: K): Array<EventMap[K]> {
    return super.listeners(event.toString()) as Array<EventMap[K]>
  }

  rawListeners<K extends keyof EventMap>(event: K): Array<EventMap[K]> {
    return super.rawListeners(event.toString()) as Array<EventMap[K]>
  }

  listenerCount<K extends keyof EventMap>(event: K): number {
    return super.listenerCount(event.toString())
  }
}
