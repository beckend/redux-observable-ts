import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { TEpic } from './model';
/**
 * Merges all epics into a single one.
 */
export declare const combineEpics: <TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(...epics: TEpic<TActionInput, TActionOutput, TStoreState>[]) => (...epicArgs: any[]) => Observable<TActionOutput>;
