import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import format from 'date-fns/format';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder, Education, Gender, General, Logger, UserInfo, UserInfoCollection } from '../../core';
import { ApiConstant, CustomHttpErrorResponse, PaginateOptions } from '../../types';
import { EMPLOYEE_API_TOKEN, EmployeeUserInfo } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class EmployeeService {
    urlDefault = this.apiConstant.endpoint;
    url = `${this.apiConstant.endpoint}/auth`;

    private errorsSub$ = new Subject<string[]>();
    errors$ = this.errorsSub$.asObservable();

    private inactivateUserErrorsSub$ = new Subject<string[]>();
    inactivateUserErrors$ = this.inactivateUserErrorsSub$.asObservable();

    private newUserSub$ = new Subject<UserInfo>();
    newUser$ = this.newUserSub$.asObservable();

    private userCollectionSub$ = new BehaviorSubject<UserInfoCollection>({ users: [], userCount: 0 });
    userCollection$ = this.userCollectionSub$.asObservable();

    private lstGenderSub$ = new BehaviorSubject<Gender[]>([]);
    lstGender$ = this.lstGenderSub$.asObservable();

    private lstEducationSub$ = new BehaviorSubject<Gender[]>([]);
    lstEducation$ = this.lstEducationSub$.asObservable();

    private lstCountrySub$ = new BehaviorSubject<Gender[]>([]);
    lstCountry$ = this.lstCountrySub$.asObservable();

    private paginateByUserRole(
        options: PaginateOptions,
        transactionName: string,
        filter?: string,
        orderBy?: string,
    ) {
        let params;
        params = new HttpParams({ encoder: new CustomEncoder() })
        const { pageIndex, pageSize } = options;
        if (filter && filter != '') {
            params = params.set('page', `${pageIndex}`).set('limit', `${pageSize}`).set('filter', `${filter}`);
        } else {
            params = params.set('page', `${pageIndex}`).set('limit', `${pageSize}`);
        }
        if (orderBy) {
            params = params.set('orderBy', orderBy);
        }
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: transactionName });
        return this.httpClient
            .get<UserInfoCollection>(`${this.apiConstant.endpoint}/user/get-all-nurse`, { params, headers })
            .pipe(
                tap(({ users, userCount }: UserInfoCollection) => {
                    const localUsers: UserInfo[] = users.map(u => {
                        const strLastLoginTime = u.lastLoginTime
                            ? format(new Date(u.lastLoginTime), 'dd MMM, yyyy HH:mm:ss')
                            : '';
                        return {
                            ...u,
                            lastLoginTime: strLastLoginTime,
                        };
                    });
                    this.userCollectionSub$.next({ users: localUsers, userCount, startAtPage: { pageIndex } });
                }),
                catchError(() => {
                    this.userCollectionSub$.next({ users: [], userCount: 0 });
                    return EMPTY;
                }),
            );
    }

    constructor(@Inject(EMPLOYEE_API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) { }

    paginteAdmins(options: PaginateOptions, filter?: string, sorter?: string) {
        return this.paginateByUserRole(options, 'Paginate Iom user list', filter, sorter);
    }

    deleteEmployee(userId: string, pageSize: number): Promise<any> {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Delete user' });
        return this.httpClient
            .delete<UserInfo>(`${this.urlDefault}/user/${userId}`, { headers })
            .pipe(
                tap(() => {
                    this.inactivateUserErrorsSub$.next([]);
                }),
                switchMap(() =>
                    this.paginteAdmins({
                        pageIndex: 0,
                        pageSize,
                    }),
                ),
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.inactivateUserErrorsSub$.next(err.errorJson.message);
                    } else {
                        this.inactivateUserErrorsSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            )
            .toPromise();
    }

    isEmailUnique(email: string) {
        const params = new HttpParams({ encoder: new CustomEncoder() }).set('email', email);
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Validate uniqueness of IOM user email' });

        return this.httpClient.get(`${this.apiConstant.endpoint}/user/isEmailUnique`, { params, headers, responseType: 'text' }).pipe(
            map(value => value === 'true'),
            catchError(err => {
                Logger.log(err);
                return EMPTY;
            }),
        );
    }

    isUsernameUnique(username: string) {
        const params = new HttpParams({ encoder: new CustomEncoder() }).set('username', username);
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Validate uniqueness of IOM username' });

        return this.httpClient.get(`${this.apiConstant.endpoint}/user/isUsernameUnique`, { params, headers, responseType: 'text' }).pipe(
            map(value => value === 'true'),
            catchError(err => {
                Logger.log(err);
                return EMPTY;
            }),
        );
    }

    createNewUser(input: EmployeeUserInfo, options: PaginateOptions){
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Create new User' });
        const { username, email, firstname, lastname, dob, genderId, phoneNumber, countryId, address, educationId } = input;
        return this.httpClient
            .post<UserInfo>(
                `${this.apiConstant.endpoint}/user/create-user`,
                {
                    username: username,
                    email: email,
                    firstname: firstname ?? "",
                    lastname: lastname ?? "",
                    dob: dob ?? "",
                    genderId: genderId ?? "",
                    phoneNumber: phoneNumber ?? "",
                    countryId: countryId ?? "",
                    address: address ?? "",
                    educationId: educationId ?? ""
                },
                { headers },
            )
            .pipe(
                tap((newUser: UserInfo) => {
                    this.newUserSub$.next(newUser);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage='';
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                        errorMessage = err.errorJson.message
                    } else {
                        this.errorsSub$.next([err.message]);
                        errorMessage = err.message;
                    }
                    return throwError(errorMessage);
                }),
            );
    }

    inactivateUser(userId: string, status: string, pageSize: number) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Inactive user' });
        const body = {
            status: status === '1' ? '0' : '1',
        };
        return this.httpClient
            .put<UserInfo>(`${this.apiConstant.endpoint}/user/${userId}/status`, body, { headers })
            .pipe(
                tap(() => {
                    this.inactivateUserErrorsSub$.next([]);
                }),
                switchMap(() =>
                    this.paginteAdmins({
                        pageIndex: 0,
                        pageSize,
                    }),
                ),
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.inactivateUserErrorsSub$.next(err.errorJson.message);
                    } else {
                        this.inactivateUserErrorsSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            );
    }

    updateUser(input: EmployeeUserInfo, options: PaginateOptions, userid: string){
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Update User' });
        const { username, email, firstname, lastname, dob, genderId, phoneNumber, countryId, address, educationId } = input;
        return this.httpClient
            .put<UserInfo>(
                `${this.apiConstant.endpoint}/user/update-user`,
                {
                    username: username,
                    email: email,
                    firstname: firstname ?? "",
                    lastname: lastname ?? "",
                    dob: dob ?? "",
                    genderId: genderId ?? "",
                    phoneNumber: phoneNumber ?? "",
                    countryId: countryId ?? "",
                    address: address ?? "",
                    educationId: educationId ?? "",
                    id: userid ?? ""
                },
                { headers },
            )
            .pipe(
                tap((newUser: UserInfo) => {
                    this.newUserSub$.next(newUser);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage='';
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                        errorMessage = err.errorJson.message
                    } else {
                        this.errorsSub$.next([err.message]);
                        errorMessage = err.message;
                    }
                    return throwError(errorMessage);
                }),
            );
    }

    getGeneralData() {
        return this.httpClient
            .get<General[]>(`${this.apiConstant.endpoint}/general`)
            .pipe(
                tap((reponses) => {
                    const genders: Gender[] = [];
                    const educations: Education[] = [];
                    const genderParent = reponses.find(x => x.parentId === "" && x.name === "gender");
                    reponses.map(respone => {
                        if(respone.parentId !== "") {
                            if(respone.parentId === genderParent.id) {
                                genders.push(respone)
                            }else {
                                educations.push(respone)
                            }
                        }
                    });
                    this.lstGenderSub$.next(genders);
                    this.lstEducationSub$.next(educations);
                }),
                catchError(() => {
                    return EMPTY;
                }),
            );
    }

    getCountryData() {
        return this.httpClient
            .get<General[]>(`${this.apiConstant.endpoint}/countries`)
            .pipe(
                tap((reponses) => {
                    this.lstCountrySub$.next(reponses);
                }),
                catchError(() => {
                    return EMPTY;
                }),
            );
    }
}
