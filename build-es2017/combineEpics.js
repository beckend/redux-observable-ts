"use strict";
/* tslint:disable: max-line-length */
const merge_1 = require("rxjs/observable/merge");
/**
 * Merges all epics into a single one.
 */
exports.combineEpics = (...epics) => {
    return (...epicArgs) => merge_1.merge(...epics.map((epic) => epic(...epicArgs)));
};
//# sourceMappingURL=combineEpics.js.map