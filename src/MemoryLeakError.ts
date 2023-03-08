import type { Emitter } from './Emitter'

export class MemoryLeakError extends Error {
  constructor(
    public readonly emitter: Emitter<any>,
    public readonly type: string | number | symbol,
    public readonly count: number
  ) {
    super(
      `Possible EventEmitter memory leak detected. ${count} ${type.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
    )
    this.name = 'MaxListenersExceededWarning'
  }
}
