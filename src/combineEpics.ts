import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { TEpic } from './model';

/**
 * Merges all epics into a single one.
 */
// tslint:disable-next-line: max-line-length
export const combineEpics = <TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(...epics: Array<TEpic<TActionInput, TActionOutput, TStoreState>>) => {
  return (...epicArgs: any[]): Observable<TActionOutput> =>
    merge(
      ...epics.map((epic: any) => epic(...epicArgs)),
    );
};
