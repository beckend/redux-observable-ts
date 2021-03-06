import { Middleware, Store } from 'redux';
import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from './ActionsObservable';
/**
 * epic
 */
export declare type TEpic<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState, TDeps> = (action$: ActionsObservable<TActionInput>, store: Store<TStoreState>, deps: TDeps) => Observable<TActionOutput>;
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
export interface IEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState, TDeps> extends Middleware {
    readonly replaceEpic: (nextEpic: TEpic<TActionInput, TActionOutput, TStoreState, TDeps>) => void;
}
