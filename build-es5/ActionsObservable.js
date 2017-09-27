"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var of_1 = require("rxjs/observable/of");
var filter_1 = require("rxjs/operator/filter");
var ActionsObservable = /** @class */ (function (_super) {
    __extends(ActionsObservable, _super);
    function ActionsObservable(actionsSubject) {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.source = actionsSubject;
        var lift = function (operator) {
            var observable = new ActionsObservable(_this);
            observable.operator = operator;
            return observable;
        };
        _this.lift = lift;
        return _this;
    }
    ActionsObservable.of = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        return new this(of_1.of.apply(void 0, actions));
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