/// <reference types="redux-actions" />
import { Middleware, Store } from 'redux';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from './ActionsObservable';
import { Action } from 'redux-actions';
/**
 * epic
 */
export interface IEpic<TAction extends Action<any>, TStoreState> {
    (action$: ActionsObservable<TAction>, store: Store<TStoreState>): Observable<TAction>;
}
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
export interface IEpicMiddleware<TAction extends Action<any>, TStoreState> extends Middleware {
    replaceEpic: (nextEpic: IEpic<TAction, TStoreState>) => void;
}
