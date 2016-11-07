"use strict";
/* tslint:disable: no-invalid-this */
/* tslint:disable: function-name */
/**
 * Temporary operator until something official comes along
 */
function __invoke(fn, ...args) {
    if (args && args.length > 0) {
        return fn.apply(this, args);
    }
    return fn.call(this);
}
exports.__invoke = __invoke;

//# sourceMappingURL=index.js.map
