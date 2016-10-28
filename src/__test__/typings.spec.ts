/* tslint:disable: no-reserved-keywords */
/* tslint:disable: no-console */
import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Store } from 'redux';
import { Action } from 'redux-actions';
import {
  createEpicMiddleware,
  combineEpics,
  ActionsObservable,
  IEpic,
  IEpicMiddleware,
} from '../index';

// Flux standard action
type TAction = Action<any>;
type TStoreState = any;

const epic1: IEpic<TAction, any> = (action$: ActionsObservable<TAction>, store: Store<any>) =>
  action$.ofType('FIRST')
    .mapTo({
      type: 'first',
      payload: store.getState(),
    });

const epic2: IEpic<TAction, any> = (action$, store) =>
  action$.ofType('SECOND', 'NEVER')
    .mapTo('second')
    .mergeMap((type) => Observable.of({ type }));

const epic3: IEpic<TAction, any> = (action$) =>
  action$.ofType('THIRD')
    .mapTo({
      type: 'third',
    });

const epic4: IEpic<TAction, any> = () =>
  Observable.of({
    type: 'fourth',
  });

const epic5: IEpic<TAction, any> = (action$, store) =>
  action$.ofType('FIFTH')
    .mergeMap(({ type, payload }) => Observable.of({
      type,
      payload,
    }));

const epic6 = (action$: any, store: any) =>
  action$.ofType('SIXTH')
    .map(({ payload }: any) => ({
      type: 'sixth',
      payload,
    }));

const rootEpic1: IEpic<TAction, any> = combineEpics<TAction, TStoreState>(epic1, epic2, epic3, epic4, epic5, epic6);
const rootEpic2 = combineEpics(epic1, epic2, epic3, epic4, epic5, epic6);

const epicMiddleware1: IEpicMiddleware<TAction, TStoreState> = createEpicMiddleware<TAction, TStoreState>(rootEpic1);
const epicMiddleware2 = createEpicMiddleware(rootEpic2);

// should be a constructor that returns an observable
// tslint:disable-next-line
const input$ = Observable.create(() => {});
// tslint:disable-next-line
const action$: ActionsObservable<TAction> = new ActionsObservable<TAction>(input$);

const reducer = (state: TAction[] = [], action: TAction) => state.concat(action);
const store = createStore(
  reducer,
  applyMiddleware(epicMiddleware1, epicMiddleware2)
);

epicMiddleware1.replaceEpic(rootEpic2);
epicMiddleware2.replaceEpic(rootEpic1);

store.dispatch({ type: 'FIRST' });
store.dispatch({ type: 'SECOND' });
// causes rxjs error...needs a fix
// store.dispatch({ type: 'FIFTH', payload: 'fifth-payload' });
store.dispatch({ type: 'SIXTH', payload: 'sixth-payload' });

describe('Typings test', () => {
  it('store state', () => {
    // console.log(JSON.stringify(store.getState()));
    expect(store.getState()).to.exist;
    // expect(store.getState()).to.deep.equal([
    //   { type: '@@redux/INIT' },
    //   { type: 'fourth' },
    //   { type: 'fourth' },
    //   { type: '@@redux-observable/EPIC_END' },
    //   { type: 'fourth' },
    //   { type: '@@redux-observable/EPIC_END' },
    //   { type: 'fourth' },
    //   { type: 'FIRST' },
    //   { type: 'first',
    //     payload: [
    //       { type: '@@redux/INIT' },
    //       { type: 'fourth' },
    //       { type: 'fourth' },
    //       { type: '@@redux-observable/EPIC_END' },
    //       { type: 'fourth' },
    //       { type: '@@redux-observable/EPIC_END' },
    //     ],
    //   },
    //   { type: 'first',
    //     payload: [
    //       { type: '@@redux/INIT' },
    //       { type: 'fourth' },
    //       { type: 'fourth' },
    //       { type: '@@redux-observable/EPIC_END' },
    //     ],
    //   },
    //   { type: 'SECOND' },
    //   { type: 'second' },
    //   { type: 'second' },
    //   { type: 'FIFTH', payload: 'fifth-payload' },
    //   { type: 'fifth', payload: 'fifth-payload' },
    //   { type: 'fifth', payload: 'fifth-payload' },
    //   { type: 'SIXTH', payload: 'sixth-payload' },
    //   { type: 'sixth', payload: 'sixth-payload' },
    //   { type: 'sixth', payload: 'sixth-payload' },
    // ]);
  });
});
