export class Promise<T, E> {
  constructor(executor: (resolve: Promise<T, E>['resolve'], reject: Promise<T, E>['reject']) => void) {
    executor(this.resolve, this.reject);
  }

  // private result?: T;
  //
  // private error?: E;

  private thenExecutor?: (result?: T, error?: E) => void;

  private catchExecutor?: (error?: E) => void;

  private resolve = (v: T) => {
    // this.result = v;
    //
    this.thenExecutor?.(v, undefined);
  };

  private reject = (e: E) => {
    // this.error = e;
    this.catchExecutor?.(e);
  };

  public then = (executor: Promise<T, E>['thenExecutor']) => {
    this.thenExecutor = executor;
    return this;
  };

  public catch = (executor: Promise<T, E>['catchExecutor']) => {
    this.catchExecutor = executor;
    return this;
  };
}
