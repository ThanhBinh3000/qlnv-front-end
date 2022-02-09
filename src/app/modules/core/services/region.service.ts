import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { catchError, shareReplay, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiConstant } from '../../types';
import { CustomEncoder } from '../custom-encoder';
import { RegionGeographies, REGION_API_TOKEN, StringValuePair } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable({
    providedIn: 'root',
})
export class RegionService implements OnDestroy {
    url = `${this.apiConstant.endpoint}/region`;

    private regionsSub$ = new Subject<StringValuePair[]>();
    regions$ = this.regionsSub$.asObservable();

    private geographiesSub$ = new Subject<{ [key: string]: StringValuePair[] }>();
    geographies$ = this.geographiesSub$.asObservable();

    private unsubscribed$ = new Subject();

    constructor(@Inject(REGION_API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) {}

    getRegions() {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Retrieve all regions and geographies' });
        const params = new HttpParams({ encoder: new CustomEncoder() })
            .set('join', 'geographies')
            .set('sort', 'value,ASC');

        this.httpClient
            .get<{ [key: string]: RegionGeographies }>(`${this.url}`, { headers, params })
            .pipe(
                catchError(() => {
                    this.regionsSub$.next([]);
                    this.geographiesSub$.next({});
                    return EMPTY;
                }),
                takeUntil(this.unsubscribed$),
                shareReplay(1),
            )
            .subscribe(results => {
                const regions = Object.keys(results).map(key => {
                    const { id, value } = results[key];
                    return {
                        id,
                        value,
                    } as StringValuePair;
                });

                const sortedGeographies = Object.keys(results).reduce((acc, key) => {
                    const { geographies } = results[key];
                    const sorted = geographies.sort((a, b) => {
                        return a.value.localeCompare(b.value);
                    });
                    acc[key] = sorted;
                    return acc;
                }, {} as { [key: string]: StringValuePair[] });

                this.regionsSub$.next(regions);
                this.geographiesSub$.next(sortedGeographies);
            });
    }

    ngOnDestroy(): void {
        this.unsubscribed$.next();
        this.unsubscribed$.complete();
    }
}
