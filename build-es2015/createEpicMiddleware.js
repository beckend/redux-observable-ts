"use strict";
const ActionsObservable_1 = require('./ActionsObservable');
const EPIC_END_1 = require('./EPIC_END');
const Subject_1 = require('rxjs/Subject');
require('rxjs/add/operator/map');
require('rxjs/add/operator/switchMap');
// import { map } from 'rxjs/operator/map';
// import { switchMap } from 'rxjs/operator/switchMap';
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
    // const eMap = map.bind(epic$);
    // const eSwitchMap = switchMap.bind(epic$);
    let store;
    const epicMiddleware = (_store) => {
        store = _store;
        return (next) => {
            epic$
                .map((epicArg) => epicArg(action$, store))
                .switchMap((actionArg$) => adapter.output(actionArg$))
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
