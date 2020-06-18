const Tracer = require('../index');

class Classy {
  constructor() {
    // this.tracer = new Tracer();
    // this.tracer = new Tracer({ log: console.trace });
    this.tracer = new Tracer({ silent: true });
  }

  method1(argument) {
    this.tracer.trace('method1', { argument });

    const something = { cool: 'yes' };
    this.tracer.crumb({ something });

    const value = this.method2('arg2');
    this.tracer.crumb({ value });

    return this.tracer.dump(value.length);
  }

  method2(argument2) {
    this.tracer.trace('method2', { argument2 });

    const anything = { cool: 'no' };
    this.tracer.crumb({ anything });

    const nothing = 'null';
    return this.tracer.dump(nothing);
  }

  method3() {
    this.tracer.trace('method3');
    
    try {
      const value = this.method2('arg3');
      throw new Error('unspecified');
    } catch (error) {
      throw this.tracer.break(error);
    }
  }
}

const instance = new Classy();
instance.method1('arg1');
// instance.method3();
