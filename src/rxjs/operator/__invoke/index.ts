/* tslint:disable: no-invalid-this */
/* tslint:disable: function-name */
/**
 * Temporary operator until something official comes along
 */
export function __invoke(fn: Function, ...args: any[]) {
  if (args && args.length > 0) {
    return fn.apply(this, args);
  }
  return fn.call(this);
}
