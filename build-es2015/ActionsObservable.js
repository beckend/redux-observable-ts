"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
const of_1 = require("rxjs/observable/of");
const filter_1 = require("rxjs/operator/filter");
class ActionsObservable extends Observable_1.Observable {
    constructor(actionsSubject) {
        super();
        this.observers = [];
        this.source = actionsSubject;
        const lift = (operator) => {
            const observable = new ActionsObservable(this);
            observable.operator = operator;
            return observable;
        };
        this.lift = lift;
    }
    static of(...actions) {
        return new this(of_1.of(...actions));
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