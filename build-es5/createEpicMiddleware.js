"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("rxjs/operators/map");
var switchMap_1 = require("rxjs/operators/switchMap");
var Subject_1 = require("rxjs/Subject");
var ActionsObservable_1 = require("./ActionsObservable");
var EPIC_END_1 = require("./EPIC_END");
var defaultAdapter = {
    input: function (action$) { return action$; },
    output: function (action$) { return action$; },
};
var defaultOptions = {
    adapter: defaultAdapter,
    dependencies: {},
};
// tslint:disable-next-line: max-line-length
function createEpicMiddleware(epic, _a) {
    var _b = _a === void 0 ? defaultOptions : _a, _c = _b.adapter, adapter = _c === void 0 ? defaultAdapter : _c, _d = _b.dependencies, dependencies = _d === void 0 ? {} : _d;
    if (typeof epic !== 'function') {
        throw new TypeError('You must provide a root Epic to createEpicMiddleware');
    }
    var input$ = new Subject_1.Subject();
    var action$ = adapter.input(new ActionsObservable_1.ActionsObservable(input$));
    var epic$ = new Subject_1.Subject();
    var store;
    // tslint:disable-next-line: variable-name
    var epicMiddleware = function (_store) {
        store = _store;
        return function (next) {
            epic$
                .pipe(map_1.map(function (epicArg) {
                var output$ = epicArg(action$, store, dependencies);
                if (!output$) {
                    // tslint:disable-next-line: max-line-length
                    throw new TypeError("Your root Epic \"" + (epic.name || '<anonymous>') + "\" does not return a stream. Double check you're not missing a return statement!");
                }
                return output$;
            }))
                .pipe(switchMap_1.switchMap(function (actionArg$) { return adapter.output(actionArg$); }))
                .subscribe(function (action) {
                try {
                    store.dispatch(action);
                }
                catch (err) {
                    // tslint:disable-next-line: no-console
                    console.error(err);
                }
            });
            // Setup initial root epic
            epic$.next(epic);
            return function (action) {
                var result = next(action);
                input$.next(action);
                return result;
            };
        };
    };
    epicMiddleware.replaceEpic = function (nextEpic) {
        // gives the previous root Epic a last chance
        // to do some clean up
        store.dispatch({ type: EPIC_END_1.EPIC_END });
        // switches to the new root Epic, synchronously terminating
        // the previous one
        epic$.next(nextEpic);
    };
    return epicMiddleware;
}
exports.createEpicMiddleware = createEpicMiddleware;
//# sourceMappingURL=createEpicMiddleware.js.map