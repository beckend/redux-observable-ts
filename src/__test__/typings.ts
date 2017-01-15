/* tslint:disable: no-reserved-keywords */
/* tslint:disable: no-console */
/* tslint:disable: max-line-length */
/* tslint:disable: object-literal-sort-keys */
import { expect } from 'chai';
import { applyMiddleware, createStore } from 'redux';
import { Store } from 'redux';
import { Action } from 'redux-actions';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import {
  ActionsObservable,
  combineEpics,
  createEpicMiddleware,
  IEpic,
  IEpicMiddleware,
} from '../index';

// Flux standard action
type TGenericAction = Action<any>;
type TStoreState = any;

const epic1: IEpic<TGenericAction, TGenericAction, any> = (action$: ActionsObservable<TGenericAction>, store: Store<any>) =>
  action$
    .ofType('FIRST')
    .mapTo({
      type: 'first',
      payload: store.getState(),
    });

const epic2: IEpic<TGenericAction, TGenericAction, any> = (action$) =>
  action$
    .ofType('SECOND', 'NEVER')
    .mapTo('second')
    .mergeMap((type) => Observable.of({ type }));

const epic3: IEpic<TGenericAction, TGenericAction, any> = (action$) =>
  action$
    .ofType('THIRD')
    .mapTo({
      type: 'third',
    });

const epic4: IEpic<TGenericAction, TGenericAction, any> = () =>
  Observable
    .of({
      type: 'fourth',
    });

const epic5: IEpic<TGenericAction, TGenericAction, any> = (action$) =>
  action$
    .ofType('FIFTH')
    .mergeMap(({ type, payload }) => Observable.of({
      payload,
      type,
    }));

const epic6 = (action$: any) =>
  action$
    .ofType('SIXTH')
    .map(({ payload }: any) => ({
      payload,
      type: 'sixth',
    }));

const rootEpic1: IEpic<TGenericAction, TGenericAction, any> = combineEpics<TGenericAction, TGenericAction, TStoreState>(epic1, epic2, epic3, epic4, epic5, epic6);
const rootEpic2 = combineEpics(epic1, epic2, epic3, epic4, epic5, epic6);

const epicMiddleware1: IEpicMiddleware<TGenericAction, TGenericAction, TStoreState> = createEpicMiddleware<TGenericAction, TGenericAction, TStoreState>(rootEpic1);
const epicMiddleware2 = createEpicMiddleware(rootEpic2);

// should be a constructor that returns an observable
// tslint:disable-next-line
const input$ = Observable.create(() => { });
// tslint:disable-next-line
const action$: ActionsObservable<TGenericAction> = new ActionsObservable<TGenericAction>(input$);
Boolean(action$);

const reducer = (state: TGenericAction[] = [], action: TGenericAction) => state.concat(action);
const store = createStore(
  reducer,
  applyMiddleware(epicMiddleware1, epicMiddleware2),
);

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
    expect(store.getState()).to.exist;
    expect(store.getState()).to.deep.equal([
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
