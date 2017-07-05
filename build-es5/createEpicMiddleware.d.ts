import { Action } from 'redux-actions';
import { IEpicAdapter, IEpicMiddleware, TEpic } from './model';
import './rxjs/add/__invoke';
export interface IDefaultOptions {
    readonly adapter: IEpicAdapter;
}
export declare function createEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(epic: TEpic<TActionInput, TActionOutput, TStoreState>, {adapter}?: IDefaultOptions): IEpicMiddleware<TActionInput, TActionOutput, TStoreState>;
