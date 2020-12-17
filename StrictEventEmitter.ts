import { EventEmitter } from 'events'

export class StrictEventEmitter<
  EventsMap extends Record<string | symbol, (...data: any[]) => void>
> extends EventEmitter {
  constructor() {
    super()
  }

  on<K extends keyof EventsMap>(event: K, listener: EventsMap[K]) {
    return super.on(event.toString(), listener)
  }

  once<K extends keyof EventsMap>(event: K, listener: EventsMap[K]) {
    return super.on(event.toString(), listener)
  }

  off<K extends keyof EventsMap>(event: K, listener: EventsMap[K]) {
    return super.off(event.toString(), listener)
  }

  emit<K extends keyof EventsMap>(event: K, ...data: Parameters<EventsMap[K]>) {
    return super.emit(event.toString(), ...data)
  }

  addListener<K extends keyof EventsMap>(event: K, listener: EventsMap[K]) {
    return super.addListener(event.toString(), listener)
  }

  removeListener<K extends keyof EventsMap>(event: K, listener: EventsMap[K]) {
    return super.removeListener(event.toString(), listener)
  }
}
