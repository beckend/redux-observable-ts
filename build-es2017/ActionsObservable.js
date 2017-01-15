"use strict";
const Observable_1 = require("rxjs/Observable");
const from_1 = require("rxjs/observable/from");
const of_1 = require("rxjs/observable/of");
const filter_1 = require("rxjs/operator/filter");
class ActionsObservable extends Observable_1.Observable {
    constructor(actionsSubject) {
        super();
        this.observers = [];
        this.source = actionsSubject;
    }
    static of(...actions) {
        return new this(of_1.of(...actions));
    }
    static from(actions, scheduler) {
        return new this(from_1.from(actions, scheduler));
    }
    lift(operator) {
        const observable = new ActionsObservable(this);
        observable.operator = operator;
        return observable;
    }
    ofType(...keys) {
        return filter_1.filter.call(this, ({ type }) => {
            const len = keys.length;
            if (len === 1) {
                return type === keys[0];
            }
            else {
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
exports.ActionsObservable = ActionsObservable;
//# sourceMappingURL=ActionsObservable.js.map