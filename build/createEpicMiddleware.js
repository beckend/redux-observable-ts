"use strict";
var ActionsObservable_1 = require('./ActionsObservable');
var EPIC_END_1 = require('./EPIC_END');
var Subject_1 = require('rxjs/Subject');
require('./rxjs/add/__invoke');
var map_1 = require('rxjs/operator/map');
var switchMap_1 = require('rxjs/operator/switchMap');
var defaultAdapter = {
    input: function (action$) { return action$; },
    output: function (action$) { return action$; },
};
var defaultOptions = {
    adapter: defaultAdapter,
};
function createEpicMiddleware(epic, _a) {
    var _b = (_a === void 0 ? defaultOptions : _a).adapter, adapter = _b === void 0 ? defaultAdapter : _b;
    if (typeof epic !== 'function') {
        throw new TypeError('You must provide a root Epic to createEpicMiddleware');
    }
    var input$ = new Subject_1.Subject();
    var action$ = adapter.input(new ActionsObservable_1.ActionsObservable(input$));
    var epic$ = new Subject_1.Subject();
    // const eMap = map.bind(epic$);
    // const eSwitchMap = switchMap.bind(epic$);
    var store;
    var epicMiddleware = function (_store) {
        store = _store;
        return function (next) {
            epic$
                .__invoke(map_1.map, function (epicArg) { return epicArg(action$, store); })
                .__invoke(switchMap_1.switchMap, function (actionArg$) { return adapter.output(actionArg$); })
                .subscribe(store.dispatch);
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
