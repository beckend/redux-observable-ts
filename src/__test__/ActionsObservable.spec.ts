import { expect } from 'chai';
import { Action } from 'redux-actions';
import { Subject } from 'rxjs/Subject';
import { ActionsObservable }  from '../ActionsObservable';

type TGenericAction = Action<any>;
type TActionArr = TGenericAction[];

describe('ActionsObservable', () => {
  it('should exist', () => {
    expect(ActionsObservable).to.be.a('function');
  });

  it('should support ActionsObservable.of(...actions)', () => {
    const output: TActionArr = [];
    const action$ = ActionsObservable.of({ type: 'FIRST' }, { type: 'SECOND' });
    action$.subscribe((x) => output.push(x));

    expect(action$).to.be.an.instanceof(ActionsObservable);
    expect(output).to.deep.equal([{ type: 'FIRST' }, { type: 'SECOND' }]);
  });

  describe('ofType operator', () => {
    it('should filter by action type', () => {
      const actions = new Subject<any>();
      const actionsObs = new ActionsObservable<any>(actions);
      const lulz: TActionArr = [];
      const haha: TActionArr = [];

      actionsObs.ofType('LULZ').subscribe((x) => lulz.push(x));
      actionsObs.ofType('HAHA').subscribe((x) => haha.push(x));

      actions.next({ type: 'LULZ', i: 0 });

      expect(lulz).to.deep.equal([{ type: 'LULZ', i: 0 }]);
      expect(haha).to.deep.equal([]);

      actions.next({ type: 'LULZ', i: 1 });

      expect(lulz).to.deep.equal([{ type: 'LULZ', i: 0 }, { type: 'LULZ', i: 1 }]);
      expect(haha).to.deep.equal([]);

      actions.next({ type: 'HAHA', i: 0 });

      expect(lulz).to.deep.equal([{ type: 'LULZ', i: 0 }, { type: 'LULZ', i: 1 }]);
      expect(haha).to.deep.equal([{ type: 'HAHA', i: 0 }]);
    });

    it('should support ActionsObservable.from(...actions, scheduler)', () => {
      const output: Array<Action<any>> = [];
      const action$ = ActionsObservable.from([{ type: 'FIRST' }, { type: 'SECOND' }]);
      action$.subscribe((x) => output.push(x));

      expect(action$).to.be.an.instanceof(ActionsObservable);
      expect(output).to.deep.equal([{ type: 'FIRST' }, { type: 'SECOND' }]);
    });

    it('should filter by multiple action types', () => {
      const actions = new Subject();
      const actionsObs = new ActionsObservable(actions);
      const lulz: TActionArr = [];
      const haha: TActionArr = [];

      actionsObs.ofType('LULZ', 'LARF').subscribe((x) => lulz.push(x));
      actionsObs.ofType('HAHA').subscribe((x) => haha.push(x));

      actions.next({ type: 'LULZ', i: 0 });

      expect(lulz).to.deep.equal([{ type: 'LULZ', i: 0 }]);
      expect(haha).to.deep.equal([]);

      actions.next({ type: 'LARF', i: 1 });

      expect(lulz).to.deep.equal([{ type: 'LULZ', i: 0 }, { type: 'LARF', i: 1 }]);
      expect(haha).to.deep.equal([]);

      actions.next({ type: 'HAHA', i: 0 });

      expect(lulz).to.deep.equal([{ type: 'LULZ', i: 0 }, { type: 'LARF', i: 1 }]);
      expect(haha).to.deep.equal([{ type: 'HAHA', i: 0 }]);
    });
  });
});
