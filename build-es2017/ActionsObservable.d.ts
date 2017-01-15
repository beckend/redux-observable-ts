import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Operator } from 'rxjs/Operator';
import { Scheduler } from 'rxjs/Scheduler';
export declare type TAction = Action<any>;
export declare class ActionsObservable<T extends TAction> extends Observable<T> {
    static of(...actions: Array<TAction | any>): ActionsObservable<Action<any>>;
    static from(actions: Array<TAction | any>, scheduler?: Scheduler): ActionsObservable<any>;
    observers: Array<Observer<T>> | null;
    source: Observable<T>;
    constructor(actionsSubject: Observable<T>);
    lift(operator: Operator<any, T>): ActionsObservable<Action<any>>;
    ofType(...keys: string[]): Observable<T>;
}
