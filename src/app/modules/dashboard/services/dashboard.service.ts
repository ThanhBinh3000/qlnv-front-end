import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Container, Nurse } from '../../core';
import { ApiConstant } from '../../types';
import {
    BookingResponse,
    ContainerResponse,
    DASHBOARD_API_TOKEN,
    DataFilterProductPatient,
    NurseResponse,
    PatientResponse,
    ProductResponse,
} from '../type';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class DashboardService {
    urlDefault = this.apiConstant.endpoint;

    private chartBookingSub$ = new Subject<BookingResponse>();
    chartBooking$ = this.chartBookingSub$.asObservable();

    private chartProductSub$ = new Subject<ProductResponse>();
    chartProduct$ = this.chartProductSub$.asObservable();

    private chartPatientSub$ = new Subject<PatientResponse>();
    chartPatient$ = this.chartPatientSub$.asObservable();

    private lstContainerSub$ = new BehaviorSubject<ContainerResponse[]>([]);
    lstContainer$ = this.lstContainerSub$.asObservable();

    private lstNurseSub$ = new BehaviorSubject<NurseResponse[]>([]);
    lstNurse$ = this.lstNurseSub$.asObservable();

    constructor(
        @Inject(DASHBOARD_API_TOKEN)
        private apiConstant: ApiConstant,
        private httpClient: HttpClient,
    ) {}

    getDataBooking(fromDate: string, toDate: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Data Booking' });
        return this.httpClient
            .post<BookingResponse>(
                `${this.urlDefault}/dashboard/get-bookings`,
                {
                    fromDate: fromDate,
                    toDate: toDate,
                },
                { headers },
            )
            .pipe(
                tap(respone => {
                    if (respone) {
                        this.chartBookingSub$.next(respone);
                    }
                }),
            );
    }

    getDataProduct(dataTime: string, nurseId: string, containerId: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Data Product' });

        return this.httpClient
            .post<ProductResponse>(
                `${this.urlDefault}/dashboard/get-product`,
                {
                    typeDate: dataTime != null ? dataTime : "day",
                    containerId: containerId != null ? containerId : "",
                    nurseId: nurseId != null ? nurseId : "",
                },
                { headers },
            )
            .pipe(
                tap(respone => {
                    if (respone) {
                        this.chartProductSub$.next(respone);
                    }
                }),
            );
    }

    getDataPatient(dataTime: string, nurseId: string, containerId: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Data Patient' });
        return this.httpClient
            .post<PatientResponse>(
                `${this.urlDefault}/dashboard/get-new-patient`,
                {
                    typeDate: dataTime != null ? dataTime : "day",
                    containerId: containerId != null ? containerId : "",
                    nurseId: nurseId != null ? nurseId : "",
                },
                { headers },
            )
            .pipe(
                tap(respone => {
                    if (respone) {
                        this.chartPatientSub$.next(respone);
                    }
                }),
            );
    }

    getContainerData() {
        return this.httpClient.get<Container[]>(`${this.apiConstant.endpoint}/container`).pipe(
            tap(reponses => {
                this.lstContainerSub$.next(reponses);
            }),
            catchError(() => {
                return EMPTY;
            }),
        );
    }

    getNurseData() {
        return this.httpClient.get<Nurse[]>(`${this.apiConstant.endpoint}/user/get-list-nurse`).pipe(
            tap(reponses => {
                this.lstNurseSub$.next(reponses);
            }),
            catchError(() => {
                return EMPTY;
            }),
        );
    }
}
