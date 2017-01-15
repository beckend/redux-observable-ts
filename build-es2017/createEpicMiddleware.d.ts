import { Action } from 'redux-actions';
import { IEpic, IEpicAdapter, IEpicMiddleware } from './model';
import './rxjs/add/__invoke';
export interface IDefaultOptions {
    readonly adapter: IEpicAdapter;
}
export declare function createEpicMiddleware<TActionInput extends Action<any>, TActionOutput extends Action<any>, TStoreState>(epic: IEpic<TActionInput, TActionOutput, TStoreState>, {adapter}?: IDefaultOptions): IEpicMiddleware<TActionInput, TActionOutput, TStoreState>;
