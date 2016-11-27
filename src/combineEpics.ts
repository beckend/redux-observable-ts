/* tslint:disable: max-line-length */
import { merge } from 'rxjs/observable/merge';
import { Observable } from 'rxjs/Observable';
import { IEpic } from './model';
import { Action } from 'redux-actions';

/**
 * Merges all epics into a single one.
 */
export const combineEpics = <TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(...epics: IEpic<TActionInput, TActionOutput, TStoreState>[]) => {
  return (...epicArgs: any[]): Observable<TActionOutput> =>
    merge<Action<any>, Action<any>>(
      ...epics.map((epic: any) => epic(...epicArgs))
    );
};
