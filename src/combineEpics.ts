import { merge } from 'rxjs/observable/merge';
import { Observable } from 'rxjs/Observable';
import { IEpic } from './model';
import { Action } from 'redux-actions';

export interface IGenericEpic {
  (...args: any[]): Observable<any>;
}

/* tslint:disable:max-line-length */
// export function combineEpics<TAction extends Action<any>, TStoreState>(...epics: IEpic<TAction, TStoreState>[]): (...args: any[]) => Observable<TAction>;

/**
 * Merges all epics into a single one.
 */
export function combineEpics<TAction extends Action<any>, TStoreState>(...epics: IEpic<TAction, TStoreState>[]) {
  return (...epicArgs: any[]) =>
    merge<TAction, TAction>(
      ...epics.map((epic: any) => epic(...epicArgs))
    );
}
