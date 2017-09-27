"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("rxjs/observable/merge");
/**
 * Merges all epics into a single one.
 */
// tslint:disable-next-line: max-line-length
exports.combineEpics = (...epics) => {
    return (...epicArgs) => merge_1.merge(...epics.map((epic) => epic(...epicArgs)));
};
//# sourceMappingURL=combineEpics.js.map