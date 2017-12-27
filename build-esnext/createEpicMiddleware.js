"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("rxjs/operators/map");
const switchMap_1 = require("rxjs/operators/switchMap");
const Subject_1 = require("rxjs/Subject");
const ActionsObservable_1 = require("./ActionsObservable");
const EPIC_END_1 = require("./EPIC_END");
const defaultAdapter = {
    input: (action$) => action$,
    output: (action$) => action$,
};
const defaultOptions = {
    adapter: defaultAdapter,
    dependencies: {},
};
// tslint:disable-next-line: max-line-length
function createEpicMiddleware(epic, { adapter = defaultAdapter, dependencies = {}, } = defaultOptions) {
    if (typeof epic !== 'function') {
        throw new TypeError('You must provide a root Epic to createEpicMiddleware');
    }
    const input$ = new Subject_1.Subject();
    const action$ = adapter.input(new ActionsObservable_1.ActionsObservable(input$));
    const epic$ = new Subject_1.Subject();
    let store;
    // tslint:disable-next-line: variable-name
    const epicMiddleware = (_store) => {
        store = _store;
        return (next) => {
            epic$
                .pipe(map_1.map((epicArg) => {
                const output$ = epicArg(action$, store, dependencies);
                if (!output$) {
                    // tslint:disable-next-line: max-line-length
                    throw new TypeError(`Your root Epic "${epic.name || '<anonymous>'}" does not return a stream. Double check you\'re not missing a return statement!`);
                }
                return output$;
            }))
                .pipe(switchMap_1.switchMap((actionArg$) => adapter.output(actionArg$)))
                .subscribe((action) => {
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