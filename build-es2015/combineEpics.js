"use strict";
const merge_1 = require('rxjs/observable/merge');
/**
 * Merges all epics into a single one.
 */
function combineEpics(...epics) {
    return (...epicArgs) => merge_1.merge(...epics.map((epic) => epic(...epicArgs)));
}
exports.combineEpics = combineEpics;

//# sourceMappingURL=combineEpics.js.map
