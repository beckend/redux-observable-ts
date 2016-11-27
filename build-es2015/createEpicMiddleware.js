"use strict";
const ActionsObservable_1 = require("./ActionsObservable");
const EPIC_END_1 = require("./EPIC_END");
const Subject_1 = require("rxjs/Subject");
require("./rxjs/add/__invoke");
const map_1 = require("rxjs/operator/map");
const switchMap_1 = require("rxjs/operator/switchMap");
const defaultAdapter = {
    input: (action$) => action$,
    output: (action$) => action$,
};
const defaultOptions = {
    adapter: defaultAdapter,
};
function createEpicMiddleware(epic, { adapter = defaultAdapter } = defaultOptions) {
    if (typeof epic !== 'function') {
        throw new TypeError('You must provide a root Epic to createEpicMiddleware');
    }
    const input$ = new Subject_1.Subject();
    const action$ = adapter.input(new ActionsObservable_1.ActionsObservable(input$));
    const epic$ = new Subject_1.Subject();
    let store;
    const epicMiddleware = (_store) => {
        store = _store;
        return (next) => {
            epic$
                .__invoke(map_1.map, (epicArg) => epicArg(action$, store))
                .__invoke(switchMap_1.switchMap, (actionArg$) => adapter.output(actionArg$))
                .subscribe(store.dispatch);
            // Setup initial root epic
            epic$.next(epic);
            return (action) => {
                const result = next(action);
                input$.next(action);
                return result;
            };
        };
    };
    epicMiddleware.replaceEpic = (nextEpic) => {
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