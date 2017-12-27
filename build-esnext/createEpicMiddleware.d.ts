import { Action } from 'redux-actions';
import { IEpicAdapter, IEpicMiddleware, TEpic } from './model';
export interface IDefaultOptions {
    readonly adapter: IEpicAdapter;
    readonly dependencies: any;
}
export declare function createEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState, TDeps>(epic: TEpic<TActionInput, TActionOutput, TStoreState, TDeps>, {adapter, dependencies}?: IDefaultOptions): IEpicMiddleware<TActionInput, TActionOutput, TStoreState, TDeps>;
