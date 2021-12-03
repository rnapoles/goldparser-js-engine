class Context {
  constructor() {
    this.returnValue = ""; /* In this template all rules return a string. */
    this.indent = 0; /* For printing debug messages. */
    this.debug = 0; /* 0=off, 1=on */
  }
}

module.exports = Context;
