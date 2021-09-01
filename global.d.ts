/* eslint @typescript-eslint/no-explicit-any: "off" */

// AssemblyScript types used.
// Add here as necessary to suppress false positive TS errors
declare type i32 = any;
declare type i64 = any;
declare const assert: any;
declare const I32: any;
declare const I64: any;

declare namespace NodeJS {
  interface Global {
    assert: any;
    I32: any;
    I64: any;
  }
}
