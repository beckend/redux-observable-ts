import { Middleware, Store } from 'redux';
import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from './ActionsObservable';

/**
 * epic
 */
export type TEpic<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState> =
  (action$: ActionsObservable<TActionInput>, store: Store<TStoreState>) => Observable<TActionOutput>;

/**
 * createEpicMiddleware adapter
 */
export interface IEpicAdapter {
  readonly input: (observable: any) => any;
  readonly output: (observable: any) => any;
}

/**
 * epic middleware returned from createEpicMiddleware
 */
// tslint:disable-next-line: max-line-length
export interface IEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState> extends Middleware {
  readonly replaceEpic: (nextEpic: TEpic<TActionInput, TActionOutput, TStoreState>) => void;
}
