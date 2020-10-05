import { Options, Response, Got } from "got";
interface CreateOptions {
  filters: Object;
  cheerioOptions: Object;
}
interface cGot extends Got {
  filters: (newFilters?: Object) => any;
  cheerio: (cheerioOptions?: Object) => any;
  recreate: (createOptions?: CreateOptions) => any;
}

declare const c: cGot;
export = c;
