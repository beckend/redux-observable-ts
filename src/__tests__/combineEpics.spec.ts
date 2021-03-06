import { expect } from 'chai';
import { Action } from 'redux-actions';
import { map } from 'rxjs/operators/map';
import { toArray } from 'rxjs/operators/toArray';
import { Subject } from 'rxjs/Subject';
import * as sinon from 'sinon';
import { ActionsObservable, combineEpics } from '../';
import {
  TEpic,
} from '../model';

type TGenericAction = Action<any>;
type TActionArr = TGenericAction[];
type TGenericEpic = TEpic<TGenericAction, TGenericAction, any, any>;

describe('combineEpics', () => {
  it('should combine epics', () => {
    // tslint:disable-next-line: no-shadowed-variable
    const epic1: TGenericEpic = (actions, store) =>
      actions.ofType('ACTION1')
        .pipe(map((action) => ({ type: 'DELEGATED1', action, store })));
    // tslint:disable-next-line: no-shadowed-variable
    const epic2: TGenericEpic = (actions, store) =>
      actions.ofType('ACTION2')
        .pipe(map((action) => ({ type: 'DELEGATED2', action, store })));

    const epic = combineEpics(
      epic1,
      epic2
    );

    const store = { I: 'am', a: 'store' };
    const subject = new Subject<TGenericAction>();
    const actions = new ActionsObservable<TGenericAction>(subject);
    const result = epic(actions, store);
    const emittedActions: TActionArr = [];

    result.subscribe((emittedAction) => emittedActions.push(emittedAction));

    subject.next({ type: 'ACTION1' });
    subject.next({ type: 'ACTION2' });

    expect(emittedActions).to.deep.equal([
      { type: 'DELEGATED1', action: { type: 'ACTION1' }, store },
      { type: 'DELEGATED2', action: { type: 'ACTION2' }, store },
    ]);
  });

  it('should pass along every argument arbitrarily', (done: jest.DoneCallback) => {
    const epic1 = sinon.stub().returns(['first']);
    const epic2 = sinon.stub().returns(['second']);

    const rootEpic = combineEpics(
      epic1,
      epic2
    );

    rootEpic(1, 2, 3, 4)
      .pipe(toArray())
      .subscribe((values) => {
        expect(values).to.deep.equal(['first', 'second']);

        expect(epic1.callCount).to.equal(1);
        expect(epic2.callCount).to.equal(1);

        expect(epic1.firstCall.args).to.deep.equal([1, 2, 3, 4]);
        expect(epic2.firstCall.args).to.deep.equal([1, 2, 3, 4]);

        done();
      });
  });
});
