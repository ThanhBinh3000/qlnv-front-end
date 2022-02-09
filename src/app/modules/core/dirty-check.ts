import * as isEqual from 'fast-deep-equal';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { Logger } from './logger';

export function dirtyCheck<U>(source: Observable<U>, initDirty: boolean) {
    return <T>(valueChanges: Observable<T>): Observable<boolean> => {
        const isDirty$ = combineLatest([source, valueChanges]).pipe(
            debounceTime(300),
            tap(([a, b]) => {
                Logger.log('source', a);
                Logger.log('value changes', b);
            }),
            map(([a, b]) => isEqual(a, b) === false),
            tap(v => Logger.log('dirty-check', v)),
            startWith(initDirty),
            shareReplay(1),
        );

        return isDirty$;
    };
}
