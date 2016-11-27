/// <reference types="redux-actions" />
import { Middleware, Store } from 'redux';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from './ActionsObservable';
import { Action } from 'redux-actions';
/**
 * epic
 */
export interface IEpic<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState> {
    (action$: ActionsObservable<TActionInput>, store: Store<TStoreState>): Observable<TActionOutput>;
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
export interface IEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState> extends Middleware {
    readonly replaceEpic: (nextEpic: IEpic<TActionInput, TActionOutput, TStoreState>) => void;
}
