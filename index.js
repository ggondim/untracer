class Tracer {
  /**
   * Creates an instance of Tracer.
   * @param {*} [{
   *     log = console.log,
   *     silent = false,
   *   }={}] options
   * @param {Function?} [options.log=console.log] The function to be used as the log method when dumping tracings. 
   * @param {boolean?} [options.silent=false] Determines if dumps should log tracings or not. True means that it will not log.
   * @memberof Tracer
   */
  constructor({
    log = console.log,
    silent = false,
  } = {}) {
    this.log = log;
    this.silent = silent;
    this.reset();
  }

  /**
   * The current method that are being traced.
   * @readonly
   * @memberof Tracer
   */
  get currentMethod() {
    return this.tree[this.tree.length - 1];
  }

  /**
   * The current tracing data of current method.
   * @readonly
   * @memberof Tracer
   */
  get currentTracing() {
    return this.tracing[this.currentMethod];
  }

  /**
   * Resets the tracer.
   * @internal
   * @memberof Tracer
   */
  reset() {
    this.tracing = {};
    this.tree = [];
  }

  /**
   * Starts a new tracing for a method.
   * @param {string} method The name of the method.
   * @param {object?} crumb Something object to crumb at the beggining of the trace.
   * @memberof Tracer
   */
  trace(method, crumb) {
    this.tree.push(method);
    this.tracing[method] = {};
    if(crumb) this.crumb(crumb);
  }

  /**
   * Leaves a crumb in the current method tracing.
   * @param {object} object The object containing any data to store.
   * @memberof Tracer
   */
  crumb(object) {
    this.tracing[this.currentMethod] = { ...this.tracing[this.currentMethod], ...object };
  }

  /**
   * If the current method is the first method being traced, logs the tracing if the tracer is not silent, and resets the tracer; or return back to previous method tracing.
   * @param {any?} result The result to be crumbed before dumping. Equivalent to `tracer.crumb({ result }); tracer.dump();`
   * @returns {void|any} If a result was specified as an argument, returns it. Otherwise, returns void.
   * @memberof Tracer
   */
  dump(result) {
    if (result) this.crumb({ result });
    this.tree.pop();
    if (!this.silent && !this.tree.length) {
      this.log({ tracing: this.tracing });
      this.reset();
    }
    if (result) return result;
  }

  /**
   * Crumbs an error, dumps the current tracing, adds the current tracing to error data and returns the error to be rethrown.
   * @param {Error} error The error thrown.
   * @returns {Error} The error with tracing data.
   * @memberof Tracer
   */
  break(error) {
    if (!error.message) error.message = error.toString();
    this.crumb({ error });
    this.dump();
    error.tracing = this.currentTracing;
    return error;
  }
}

module.exports = Tracer;
