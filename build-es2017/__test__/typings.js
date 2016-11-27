"use strict";
/* tslint:disable: no-reserved-keywords */
/* tslint:disable: no-console */
/* tslint:disable: max-line-length */
const chai_1 = require("chai");
const redux_1 = require("redux");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
const index_1 = require("../index");
const epic1 = (action$, store) => action$
    .ofType('FIRST')
    .mapTo({
    type: 'first',
    payload: store.getState(),
});
const epic2 = (action$) => action$
    .ofType('SECOND', 'NEVER')
    .mapTo('second')
    .mergeMap((type) => Observable_1.Observable.of({ type }));
const epic3 = (action$) => action$
    .ofType('THIRD')
    .mapTo({
    type: 'third',
});
const epic4 = () => Observable_1.Observable
    .of({
    type: 'fourth',
});
const epic5 = (action$) => action$
    .ofType('FIFTH')
    .mergeMap(({ type, payload }) => Observable_1.Observable.of({
    type,
    payload,
}));
const epic6 = (action$) => action$
    .ofType('SIXTH')
    .map(({ payload }) => ({
    type: 'sixth',
    payload,
}));
const rootEpic1 = index_1.combineEpics(epic1, epic2, epic3, epic4, epic5, epic6);
const rootEpic2 = index_1.combineEpics(epic1, epic2, epic3, epic4, epic5, epic6);
const epicMiddleware1 = index_1.createEpicMiddleware(rootEpic1);
const epicMiddleware2 = index_1.createEpicMiddleware(rootEpic2);
// should be a constructor that returns an observable
// tslint:disable-next-line
const input$ = Observable_1.Observable.create(() => { });
// tslint:disable-next-line
const action$ = new index_1.ActionsObservable(input$);
Boolean(action$);
const reducer = (state = [], action) => state.concat(action);
const store = redux_1.createStore(reducer, redux_1.applyMiddleware(epicMiddleware1, epicMiddleware2));
epicMiddleware1.replaceEpic(rootEpic2);
epicMiddleware2.replaceEpic(rootEpic1);
store.dispatch({ type: 'FIRST' });
store.dispatch({ type: 'SECOND' });
store.dispatch({ type: 'THIRD' });
store.dispatch({ type: 'fourth' });
store.dispatch({ type: 'FIFTH', payload: 'fifth-payload' });
store.dispatch({ type: 'SIXTH', payload: 'sixth-payload' });
describe('Typings test', () => {
    it('store state', () => {
        chai_1.expect(store.getState()).to.exist;
        chai_1.expect(store.getState()).to.deep.equal([
            { type: '@@redux/INIT' },
            { type: 'fourth' },
            { type: 'fourth' },
            { type: '@@redux-observable/EPIC_END' },
            { type: 'fourth' },
            { type: '@@redux-observable/EPIC_END' },
            { type: 'fourth' },
            { type: 'FIRST' },
            {
                type: 'first',
                payload: [
                    { type: '@@redux/INIT' },
                    { type: 'fourth' },
                    { type: 'fourth' },
                    { type: '@@redux-observable/EPIC_END' },
                    { type: 'fourth' },
                    { type: '@@redux-observable/EPIC_END' },
                ],
            },
            {
                type: 'first',
                payload: [
                    { type: '@@redux/INIT' },
                    { type: 'fourth' },
                    { type: 'fourth' },
                    { type: '@@redux-observable/EPIC_END' },
                ],
            },
            { type: 'SECOND' },
            { type: 'second' },
            { type: 'second' },
            { type: 'FIFTH', payload: 'fifth-payload' },
            { type: 'fifth', payload: 'fifth-payload' },
            { type: 'fifth', payload: 'fifth-payload' },
            { type: 'SIXTH', payload: 'sixth-payload' },
            { type: 'sixth', payload: 'sixth-payload' },
            { type: 'sixth', payload: 'sixth-payload' },
        ]);
    });
});
//# sourceMappingURL=typings.js.map