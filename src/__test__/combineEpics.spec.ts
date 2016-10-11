import { expect } from 'chai';
import * as sinon from 'sinon';
import { combineEpics, ActionsObservable } from '../';
import { Subject } from 'rxjs/Subject';
import { Action } from 'redux-actions';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toArray';
// import { map } from 'rxjs/operator/map';
import { toArray } from 'rxjs/operator/toArray';
import {
  IEpic,
} from '../model';

type TActionArr = Action<any>[];
type TGenericEpic = IEpic<any, any>;

describe('combineEpics', () => {
  it('should combine epics', () => {
    const epic1: TGenericEpic = (actions, store) =>
      actions.ofType('ACTION1')
        .map((action) => ({ type: 'DELEGATED1', action, store }));
    const epic2: TGenericEpic = (actions, store) =>
      actions.ofType('ACTION2')
        .map((action) => ({ type: 'DELEGATED2', action, store }));

    const epic = combineEpics(
      epic1,
      epic2
    );

    const store = { I: 'am', a: 'store' };
    const subject = new Subject();
    const actions = new ActionsObservable(subject);
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

    toArray.call(rootEpic(1, 2, 3, 4)).subscribe((values: any) => {
      expect(values).to.deep.equal(['first', 'second']);

      expect(epic1.callCount).to.equal(1);
      expect(epic2.callCount).to.equal(1);

      expect(epic1.firstCall.args).to.deep.equal([1, 2, 3, 4]);
      expect(epic2.firstCall.args).to.deep.equal([1, 2, 3, 4]);

      done();
    });
  });
});
