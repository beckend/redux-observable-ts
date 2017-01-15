"use strict";
/* tslint:disable: no-reserved-keywords */
/* tslint:disable: no-console */
/* tslint:disable: max-line-length */
/* tslint:disable: object-literal-sort-keys */
var chai_1 = require("chai");
var redux_1 = require("redux");
require("rxjs/add/observable/of");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/mergeMap");
var Observable_1 = require("rxjs/Observable");
var index_1 = require("../index");
var epic1 = function (action$, store) {
    return action$
        .ofType('FIRST')
        .mapTo({
        type: 'first',
        payload: store.getState(),
    });
};
var epic2 = function (action$) {
    return action$
        .ofType('SECOND', 'NEVER')
        .mapTo('second')
        .mergeMap(function (type) { return Observable_1.Observable.of({ type: type }); });
};
var epic3 = function (action$) {
    return action$
        .ofType('THIRD')
        .mapTo({
        type: 'third',
    });
};
var epic4 = function () {
    return Observable_1.Observable
        .of({
        type: 'fourth',
    });
};
var epic5 = function (action$) {
    return action$
        .ofType('FIFTH')
        .mergeMap(function (_a) {
        var type = _a.type, payload = _a.payload;
        return Observable_1.Observable.of({
            payload: payload,
            type: type,
        });
    });
};
var epic6 = function (action$) {
    return action$
        .ofType('SIXTH')
        .map(function (_a) {
        var payload = _a.payload;
        return ({
            payload: payload,
            type: 'sixth',
        });
    });
};
var rootEpic1 = index_1.combineEpics(epic1, epic2, epic3, epic4, epic5, epic6);
var rootEpic2 = index_1.combineEpics(epic1, epic2, epic3, epic4, epic5, epic6);
var epicMiddleware1 = index_1.createEpicMiddleware(rootEpic1);
var epicMiddleware2 = index_1.createEpicMiddleware(rootEpic2);
// should be a constructor that returns an observable
// tslint:disable-next-line
var input$ = Observable_1.Observable.create(function () { });
// tslint:disable-next-line
var action$ = new index_1.ActionsObservable(input$);
Boolean(action$);
var reducer = function (state, action) {
    if (state === void 0) { state = []; }
    return state.concat(action);
};
var store = redux_1.createStore(reducer, redux_1.applyMiddleware(epicMiddleware1, epicMiddleware2));
epicMiddleware1.replaceEpic(rootEpic2);
epicMiddleware2.replaceEpic(rootEpic1);
store.dispatch({ type: 'FIRST' });
store.dispatch({ type: 'SECOND' });
store.dispatch({ type: 'THIRD' });
store.dispatch({ type: 'fourth' });
store.dispatch({ type: 'FIFTH', payload: 'fifth-payload' });
store.dispatch({ type: 'SIXTH', payload: 'sixth-payload' });
describe('Typings test', function () {
    it('store state', function () {
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