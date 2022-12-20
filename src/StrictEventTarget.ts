import { EventMapType } from './StrictEventEmitter'

export type StrictListener<Type extends string, Data> = (
  message: StrictMessageEvent<Type, Data>
) => void

/**
 * A type-safe implementation of the `EventTarget` interface.
 */
export class StrictEventTarget<
  EventMap extends EventMapType
> extends EventTarget {
  public dispatchEvent<Event extends keyof EventMap & string>(
    event: StrictMessageEvent<Event, EventMap[Event]>
  ): boolean {
    return super.dispatchEvent(event)
  }

  public addEventListener<Type extends keyof EventMap>(
    type: Type,
    listener: StrictListener<Type & string, EventMap[Type]>,
    options?: boolean | AddEventListenerOptions
  ): void {
    return super.addEventListener(type as string, listener, options)
  }

  public removeEventListener<Type extends keyof EventMap>(
    type: Type,
    listener: StrictListener<Type & string, EventMap[Type]>,
    options?: boolean | EventListenerOptions
  ): void {
    return super.removeEventListener(type as string, listener, options)
  }
}

/**
 * A type-safe implementation of `MessageEvent`.
 * Allows for more strict `type` property to restrict
 * what types of events can be emitted.
 */
export class StrictMessageEvent<
  Type extends string,
  Data
> extends MessageEvent<Data> {
  public type: Type

  constructor(type: Type, eventInitDict?: MessageEventInit<Data>) {
    super(type, eventInitDict)
  }
}
