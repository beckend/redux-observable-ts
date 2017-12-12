import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
export declare type TAction = Action<any>;
export declare class ActionsObservable<T extends TAction> extends Observable<T> {
    static of(...actions: Array<TAction | any>): ActionsObservable<any>;
    observers: Array<Observer<T>> | null;
    source: Observable<T>;
    constructor(actionsSubject: Observable<T>);
    ofType(...keys: string[]): Observable<T>;
}
