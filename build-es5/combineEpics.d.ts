/// <reference types="redux-actions" />
import { Observable } from 'rxjs/Observable';
import { IEpic } from './model';
import { Action } from 'redux-actions';
/**
 * Merges all epics into a single one.
 */
export declare const combineEpics: <TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(...epics: IEpic<TActionInput, TActionOutput, TStoreState>[]) => (...epicArgs: any[]) => Observable<TActionOutput>;
