import { Got } from "got";
import pThrottle from "p-throttle";

interface CreateOptions {
  filters?: Object;
  cheerio?: Object;
  userAgent?: String;
  delay?: Number | Array<Number>;
  proxy?: String | Function;
  throttle?: pThrottle.Options;
  disableParse?: true;
}
interface CGot extends Got {
  filters: (newFilters?: Object) => CGot;
  cheerio: (cheerioOptions?: Object) => CGot;
  userAgent: (ua?: String) => CGot;
  delay: (ms?: Number | Array<Number>) => CGot;
  proxy: (proxyGen?: String | Function) => CGot;
  throttle?: (options?: pThrottle.Options) => CGot;
  recreate: (createOptions?: CreateOptions) => CGot;
}

declare const c: CGot;
export = c;
