/* tslint:disable: no-increment-decrement */
/* tslint:disable: no-reserved-keywords */
/* tslint:disable: function-name */
/* tslint:disable: prefer-array-literal */
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { Operator } from 'rxjs/Operator';
import { filter } from 'rxjs/operator/filter';
import { Action } from 'redux-actions';

export type TAction = Action<any>;

export class ActionsObservable<T extends TAction> extends Observable<T> {

  public observers: Observer<T>[] | null = [];

  public source: Observable<T>;

  public static of(...actions: Array<TAction | any>) {
    return new this((of(...actions) as any));
  }

  constructor(actionsSubject: Observable<T>) {
    super();
    this.source = actionsSubject;
  }

  public lift(operator: Operator<any, T>) {
    const observable = new ActionsObservable((this as any));
    observable.operator = operator;
    return observable;
  }

  public ofType(...keys: string[]): Observable<T> {
    return filter.call(this, ({ type }: T) => {
      const len = keys.length;
      if (len === 1) {
        return type === keys[0];
      } else {
        for (let i = 0; i < len; i++) {
          if (keys[i] === type) {
            return true;
          }
        }
      }
      return false;
    });
  }
}
