"use strict";
var tslib_1 = require("tslib");
var Observable_1 = require("rxjs/Observable");
var from_1 = require("rxjs/observable/from");
var of_1 = require("rxjs/observable/of");
var filter_1 = require("rxjs/operator/filter");
var ActionsObservable = (function (_super) {
    tslib_1.__extends(ActionsObservable, _super);
    function ActionsObservable(actionsSubject) {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.source = actionsSubject;
        return _this;
    }
    ActionsObservable.of = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        return new this(of_1.of.apply(void 0, actions));
    };
    ActionsObservable.from = function (actions, scheduler) {
        return new this(from_1.from(actions, scheduler));
    };
    ActionsObservable.prototype.lift = function (operator) {
        var observable = new ActionsObservable(this);
        observable.operator = operator;
        return observable;
    };
    ActionsObservable.prototype.ofType = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return filter_1.filter.call(this, function (_a) {
            var type = _a.type;
            var len = keys.length;
            if (len === 1) {
                return type === keys[0];
            }
            else {
                for (var i = 0; i < len; i++) {
                    if (keys[i] === type) {
                        return true;
                    }
                }
            }
            return false;
        });
    };
    return ActionsObservable;
}(Observable_1.Observable));
exports.ActionsObservable = ActionsObservable;
//# sourceMappingURL=ActionsObservable.js.map