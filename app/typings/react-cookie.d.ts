declare module "react-cookie" {
  function load(name: string, doNotParse?: boolean): void;
  function save(name: string, value: any, opt?: CookieOptions): void;
  function remove(name: string, opt?: CookieOptions): void;

  interface CookieOptions {
    path?: string;
    expires?: Date;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
  }

  export default class ReactCookie {}
}