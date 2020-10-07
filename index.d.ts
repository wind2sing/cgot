import { Got } from "got";
interface CreateOptions {
  filters?: Object;
  cheerio?: Object;
  userAgent?: String;
  delay?: Number;
  disableParse?: true;
}
interface CGot extends Got {
  filters: (newFilters?: Object) => CGot;
  cheerio: (cheerioOptions?: Object) => CGot;
  userAgent: (ua?: String) => CGot;
  delay: (ms?: Number) => CGot;
  recreate: (createOptions?: CreateOptions) => CGot;
}

declare const c: CGot;
export = c;
