/// <reference types="redux-actions" />
import { Action } from 'redux-actions';
import { IEpicAdapter, IEpic, IEpicMiddleware } from './model';
import './rxjs/add/__invoke';
export interface IDefaultOptions {
    adapter: IEpicAdapter;
}
export declare function createEpicMiddleware<TAction extends Action<any>, TStoreState>(epic: IEpic<TAction, TStoreState>, {adapter}?: IDefaultOptions): IEpicMiddleware<TAction, TStoreState>;
