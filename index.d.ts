import { Got } from "got";
interface CreateOptions {
  filters?: Object;
  cheerio?: Object;
  userAgent?: String;
  disableParse?: true;
}
interface CGot extends Got {
  filters: (newFilters?: Object) => CGot;
  cheerio: (cheerioOptions?: Object) => CGot;
  userAgent: (ua?: String) => CGot;
  recreate: (createOptions?: CreateOptions) => CGot;
}

declare const c: CGot;
export = c;
