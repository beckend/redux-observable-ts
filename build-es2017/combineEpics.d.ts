/// <reference types="redux-actions" />
import { Observable } from 'rxjs/Observable';
import { IEpic } from './model';
import { Action } from 'redux-actions';
/**
 * Merges all epics into a single one.
 */
export declare function combineEpics<TAction extends Action<any>, TStoreState>(...epics: IEpic<TAction, TStoreState>[]): (...epicArgs: any[]) => Observable<TAction>;
