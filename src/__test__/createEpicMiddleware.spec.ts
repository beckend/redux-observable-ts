/**
 * We need to import the operators separately and not add them to the Observable
 * prototype, otherwise we might accidentally cover-up that the source we're
 * testing uses an operator that it does not import!
 */
import { expect } from 'chai';
import '../rxjs/add/__invoke';
import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, ActionsObservable, EPIC_END } from '../index';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { mergeStatic } from 'rxjs/operator/merge';
import { mapTo } from 'rxjs/operator/mapTo';
import { Action } from 'redux-actions';
import {
  MiddlewareAPI,
  Dispatch,
  Reducer,
} from 'redux';
import {
  IEpic,
} from '../model';

type middlewareFn<S> = <S>(api: MiddlewareAPI<S>) => (next: Dispatch<S>) => Dispatch<S>;
type TGenericAction = Action<any>;
type TActionArr = TGenericAction[];

describe('createEpicMiddleware', () => {
  it('should provide epics a stream of action$ in and the "lite" store', () => {
    const reducer: Reducer<any> = (state: TActionArr = [], action: TGenericAction) => state.concat(action);
    const epic = sinon.stub().returns(empty());
    const epicMiddleware = createEpicMiddleware(epic);
    const mockMiddleware: middlewareFn<any> = <S>(store: MiddlewareAPI<S>) => (next: Dispatch<S>) => (action: any) => {
      (expect(epic).to.have.been as any).calledOnce();
      expect(epic.firstCall.args[0]).to.be.instanceOf(ActionsObservable);
      expect(epic.firstCall.args[1]).to.equal(store);
    };
    createStore(reducer, applyMiddleware(epicMiddleware, mockMiddleware));
  });

  it('should accept an epic that wires up action$ input to action$ out', () => {
    const reducer: Reducer<any> = (state: TActionArr = [], action: TGenericAction) => state.concat(action);
    const epic: IEpic<TGenericAction, any> = (action$, store) =>
      mergeStatic(
        action$.ofType('FIRE_1')
          .__invoke(mapTo, { type: 'ACTION_1' }),
        action$.ofType('FIRE_2')
          .__invoke(mapTo, { type: 'ACTION_2' }),
      );

    const middleware = createEpicMiddleware(epic);

    const store = createStore(reducer, applyMiddleware(middleware));

    store.dispatch({ type: 'FIRE_1' });
    store.dispatch({ type: 'FIRE_2' });

    expect(store.getState()).to.deep.equal([
      { type: '@@redux/INIT' },
      { type: 'FIRE_1' },
      { type: 'ACTION_1' },
      { type: 'FIRE_2' },
      { type: 'ACTION_2' },
    ]);
  });

  it('should allow you to replace the root epic with middleware.replaceEpic(epic)', () => {
    const reducer: Reducer<any> = (state: TActionArr = [], action: TGenericAction) => state.concat(action);
    const epic1: IEpic<TGenericAction, any> = (action$) =>
      mergeStatic(
        of({ type: 'EPIC_1' }),
        action$.ofType('FIRE_1')
          .__invoke(mapTo, { type: 'ACTION_1' }),
        action$.ofType('FIRE_2')
          .__invoke(mapTo, { type: 'ACTION_2' }),
        action$.ofType('FIRE_GENERIC')
          .__invoke(mapTo, { type: 'EPIC_1_GENERIC' }),
        action$.ofType(EPIC_END)
          .__invoke(mapTo, { type: 'CLEAN_UP_AISLE_3' })
      );
    const epic2: IEpic<TGenericAction, any> = (action$) =>
      mergeStatic(
        of({ type: 'EPIC_2' }),
        action$.ofType('FIRE_3')
          .__invoke(mapTo, { type: 'ACTION_3' }),
        action$.ofType('FIRE_4')
          .__invoke(mapTo, { type: 'ACTION_4' }),
        action$.ofType('FIRE_GENERIC')
          .__invoke(mapTo, { type: 'EPIC_2_GENERIC' })
      );

    const middleware = createEpicMiddleware(epic1);

    const store = createStore(reducer, applyMiddleware(middleware));

    store.dispatch({ type: 'FIRE_1' });
    store.dispatch({ type: 'FIRE_2' });
    store.dispatch({ type: 'FIRE_GENERIC' });

    middleware.replaceEpic(epic2);

    store.dispatch({ type: 'FIRE_3' });
    store.dispatch({ type: 'FIRE_4' });
    store.dispatch({ type: 'FIRE_GENERIC' });

    expect(store.getState()).to.deep.equal([
      { type: '@@redux/INIT' },
      { type: 'EPIC_1' },
      { type: 'FIRE_1' },
      { type: 'ACTION_1' },
      { type: 'FIRE_2' },
      { type: 'ACTION_2' },
      { type: 'FIRE_GENERIC' },
      { type: 'EPIC_1_GENERIC' },
      { type: EPIC_END },
      { type: 'CLEAN_UP_AISLE_3' },
      { type: 'EPIC_2' },
      { type: 'FIRE_3' },
      { type: 'ACTION_3' },
      { type: 'FIRE_4' },
      { type: 'ACTION_4' },
      { type: 'FIRE_GENERIC' },
      { type: 'EPIC_2_GENERIC' },
    ]);
  });

  it('supports an adapter for Epic input/output', () => {
    const reducer: Reducer<any> = (state: TActionArr = [], action: TGenericAction) => state.concat(action);
    const epic = (input: any) => input + 1;

    const adapter = {
      input: () => 1,
      output: (value: number) => of({
        type: value + 1,
      }),
    };
    const middleware = createEpicMiddleware(epic, { adapter });

    const store = createStore(reducer, applyMiddleware(middleware));

    expect(store.getState()).to.deep.equal([
      { type: '@@redux/INIT' },
      { type: 3 },
    ]);
  });
});
