"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable: ban-types */
/* tslint:disable: function-name */
/* tslint:disable: no-invalid-this */
/**
 * Temporary operator until something official comes along
 */
function __invoke(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return fn.apply(this, args);
}
exports.__invoke = __invoke;
//# sourceMappingURL=index.js.map