/* tslint:disable: ban-types */
/* tslint:disable: function-name */
/* tslint:disable: no-invalid-this */
/**
 * Temporary operator until something official comes along
 */
export function __invoke<TFN>(fn: TFN, ...args: any[]) {
  return (fn as any).apply(this, args);
}
