import { Action } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { Operator } from 'rxjs/Operator';
import { filter } from 'rxjs/operator/filter';

export type TAction = Action<any>;

export class ActionsObservable<T extends TAction> extends Observable<T> {

  public static of(...actions: Array<TAction | any>) {
    return new this(of(...actions));
  }

  public observers: Array<Observer<T>> | null = [];

  public source: Observable<T>;

  constructor(actionsSubject: Observable<T>) {
    super();
    this.source = actionsSubject;

    const lift = <RLift extends TAction>(operator: Operator<T, RLift>) => {
      const observable = new ActionsObservable((this as any));
      observable.operator = operator;
      return observable;
    };

    this.lift = lift as any;
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
