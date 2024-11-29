import { QueryObserverOptions, QueryObserverResult } from 'react-query/types/core/types';
import { QueryClient } from 'react-query/types/core/queryClient';
import { NotifyOptions } from 'react-query/types/core/queryObserver';
import { Subscribable } from 'react-query/types/core/subscribable';
declare type QueriesObserverListener = (result: QueryObserverResult[]) => void;
export declare class QueriesObserver extends Subscribable<QueriesObserverListener> {
    private client;
    private result;
    private queries;
    private observers;
    private observersMap;
    constructor(client: QueryClient, queries?: QueryObserverOptions[]);
    protected onSubscribe(): void;
    protected onUnsubscribe(): void;
    destroy(): void;
    setQueries(queries: QueryObserverOptions[], notifyOptions?: NotifyOptions): void;
    getCurrentResult(): QueryObserverResult[];
    getOptimisticResult(queries: QueryObserverOptions[]): QueryObserverResult[];
    private findMatchingObservers;
    private getObserver;
    private updateObservers;
    private onUpdate;
    private notify;
}
export {};
