import { Got } from "got";
interface CreateOptions {
  filters: Object;
  cheerioOptions: Object;
}
interface CGot extends Got {
  filters: (newFilters?: Object) => any;
  cheerio: (cheerioOptions?: Object) => any;
  recreate: (createOptions?: CreateOptions) => any;
}

declare const c: CGot;
export = c;
