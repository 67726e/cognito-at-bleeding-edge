
export interface Logger {
  debug(...args: any): void;
  error(...args: any): void;
  info(...args: any): void;
}

export class DefaultLogger implements Logger {
  debug = (...args: any) => console.debug(args);
  error = (...args: any) => console.error(args);
  info = (...args: any) => console.info(args);
}
