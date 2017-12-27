import {
  Dispatch,
  Store,
} from 'redux';
import { Action } from 'redux-actions';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';
import { ActionsObservable } from './ActionsObservable';
import { EPIC_END } from './EPIC_END';
import {
  IEpicAdapter,
  IEpicMiddleware,
  TEpic,
} from './model';

const defaultAdapter: IEpicAdapter = {
  input: (action$: any) => action$,
  output: (action$: any) => action$,
};

export interface IDefaultOptions {
  readonly adapter: IEpicAdapter;
  readonly dependencies: any;
}
const defaultOptions = {
  adapter: defaultAdapter,
  dependencies: {},
};

// tslint:disable-next-line: max-line-length
export function createEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState, TDeps>(
  epic: TEpic<TActionInput, TActionOutput, TStoreState, TDeps>,
  {
    adapter = defaultAdapter,
    dependencies = {},
  }: IDefaultOptions = defaultOptions
) {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide a root Epic to createEpicMiddleware');
  }

  const input$ = new Subject<Action<any>>();
  const action$: ActionsObservable<Action<any>> = adapter.input(
    new ActionsObservable(input$)
  );
  const epic$ = new Subject<TEpic<any, TActionOutput, TStoreState, TDeps>>();

  let store: Store<TStoreState>;
  // tslint:disable-next-line: variable-name
  const epicMiddleware = (_store: Store<TStoreState>) => {
    store = _store;

    return (next: Dispatch<Action<any>>) => {
      epic$
        .pipe(map((epicArg) => {
          const output$ = epicArg(action$, store, dependencies);
          if (!output$) {
            // tslint:disable-next-line: max-line-length
            throw new TypeError(`Your root Epic "${epic.name || '<anonymous>'}" does not return a stream. Double check you\'re not missing a return statement!`);
          }

          return output$;
        }))
        .pipe(switchMap((actionArg$) => adapter.output(actionArg$)))
        .subscribe((action: any) => {
          try {
            store.dispatch(action);
          } catch (err) {
            // tslint:disable-next-line: no-console
            console.error(err);
          }
        });

      // Setup initial root epic
      epic$.next(epic);

      return (action: Action<any>) => {
        const result = next(action);
        input$.next(action);
        return result;
      };
    };
  };

  (epicMiddleware as any).replaceEpic = (nextEpic: TEpic<TActionInput, TActionOutput, TStoreState, TDeps>) => {
    // gives the previous root Epic a last chance
    // to do some clean up
    store.dispatch({ type: EPIC_END });
    // switches to the new root Epic, synchronously terminating
    // the previous one
    epic$.next(nextEpic);
  };

  return epicMiddleware as IEpicMiddleware<TActionInput, TActionOutput, TStoreState, TDeps>;
}
