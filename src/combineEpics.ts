/* tslint:disable: max-line-length */
import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { IEpic } from './model';

/**
 * Merges all epics into a single one.
 */
export const combineEpics = <TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(...epics: Array<IEpic<TActionInput, TActionOutput, TStoreState>>) => {
  return (...epicArgs: any[]): Observable<TActionOutput> =>
    merge<Action<any>, Action<any>>(
      ...epics.map((epic: any) => epic(...epicArgs)),
    );
};
