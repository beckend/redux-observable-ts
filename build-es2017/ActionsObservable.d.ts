/// <reference types="redux-actions" />
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Operator } from 'rxjs/Operator';
import { Action } from 'redux-actions';
export declare type TAction = Action<any>;
export declare class ActionsObservable<T extends TAction> extends Observable<T> {
    observers: Observer<T>[] | null;
    source: Observable<T>;
    static of(...actions: Array<TAction | any>): ActionsObservable<Action<any>>;
    constructor(actionsSubject: Observable<T>);
    lift(operator: Operator<any, T>): ActionsObservable<Action<any>>;
    ofType(...keys: string[]): Observable<T>;
}
