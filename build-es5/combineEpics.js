"use strict";
/* tslint:disable: max-line-length */
var merge_1 = require("rxjs/observable/merge");
/**
 * Merges all epics into a single one.
 */
exports.combineEpics = function () {
    var epics = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        epics[_i] = arguments[_i];
    }
    return function () {
        var epicArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            epicArgs[_i] = arguments[_i];
        }
        return merge_1.merge.apply(void 0, epics.map(function (epic) { return epic.apply(void 0, epicArgs); }));
    };
};
//# sourceMappingURL=combineEpics.js.map