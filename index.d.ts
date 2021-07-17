import { Got } from "got";
import PQueue from "p-queue";

interface CreateOptions {
  filters?: Object;
  cheerio?: Object;
  userAgent?: String;
  delay?: Number | Array<Number>;
  proxy?: String | Function;
  queue?: QueueOptions;
  disableParse?: true;
}
interface CGot extends Got {
  filters: (newFilters?: Object) => CGot;
  cheerio: (cheerioOptions?: Object) => CGot;
  userAgent: (ua?: String) => CGot;
  delay: (ms?: Number | Array<Number>) => CGot;
  proxy: (proxyGen?: String | Function) => CGot;
  queue?: (options?: QueueOptions) => CGot;
  recreate: (createOptions?: CreateOptions) => CGot;

  _queue: PQueue;
}

declare const c: CGot;
export = c;

interface QueueOptions {
  /**
    Concurrency limit.

    Minimum: `1`.

    @default Infinity
    */
  concurrency?: number;
  /**
    Whether queue tasks within concurrency limit, are auto-executed as soon as they're added.

    @default true
    */
  autoStart?: boolean;
  /**
    Class with a `enqueue` and `dequeue` method, and a `size` getter. See the [Custom QueueClass](https://github.com/sindresorhus/p-queue#custom-queueclass) section.
    */
  queueClass?: any;
  /**
    The max number of runs in the given interval of time.

    Minimum: `1`.

    @default Infinity
    */
  intervalCap?: number;
  /**
    The length of time in milliseconds before the interval count resets. Must be finite.

    Minimum: `0`.

    @default 0
    */
  interval?: number;
  /**
    Whether the task must finish in the given interval or will be carried over into the next interval count.

    @default false
    */
  carryoverConcurrencyCount?: boolean;
  /**
    Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
    */
  timeout?: number;
  /**
    Whether or not a timeout is considered an exception.

    @default false
    */
  throwOnTimeout?: boolean;
}
