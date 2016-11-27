/* tslint:disable: variable-name */
import { Action } from 'redux-actions';
import {
  Store,
  Dispatch,
} from 'redux';
import { ActionsObservable } from './ActionsObservable';
import { EPIC_END } from './EPIC_END';
import {
  IEpicAdapter,
  IEpic,
  IEpicMiddleware,
} from './model';
import { Subject } from 'rxjs/Subject';
import './rxjs/add/__invoke';
import { map } from 'rxjs/operator/map';
import { switchMap } from 'rxjs/operator/switchMap';

const defaultAdapter: IEpicAdapter = {
  input: (action$: any) => action$,
  output: (action$: any) => action$,
};

export interface IDefaultOptions {
  readonly adapter: IEpicAdapter;
}
const defaultOptions = {
  adapter: defaultAdapter,
};

export function createEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(
  epic: IEpic<TActionInput, TActionOutput, TStoreState>, { adapter = defaultAdapter }: IDefaultOptions = defaultOptions
) {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide a root Epic to createEpicMiddleware');
  }

  const input$ = new Subject();
  const action$: ActionsObservable<Action<any>> = adapter.input(
    new ActionsObservable(input$)
  );
  const epic$ = new Subject();

  let store: Store<any>;
  const epicMiddleware = (_store: Store<any>) => {
    store = _store;

    return (next: Dispatch<Action<any>>) => {
      epic$
        .__invoke(map, (epicArg: IEpic<Action<any>, Action<any>, TStoreState>) => epicArg(action$, store))
        .__invoke(switchMap, (actionArg$: ActionsObservable<Action<any>>) => adapter.output(actionArg$))
        .subscribe(store.dispatch);

      // Setup initial root epic
      epic$.next(epic);

      return (action: Action<any>) => {
        const result = next(action);
        input$.next(action);
        return result;
      };
    };
  };

  (epicMiddleware as any).replaceEpic = (nextEpic: IEpic<TActionInput, TActionOutput, TStoreState>) => {
    // gives the previous root Epic a last chance
    // to do some clean up
    store.dispatch({ type: EPIC_END });
    // switches to the new root Epic, synchronously terminating
    // the previous one
    epic$.next(nextEpic);
  };

  return epicMiddleware as IEpicMiddleware<TActionInput, TActionOutput, TStoreState>;
}
