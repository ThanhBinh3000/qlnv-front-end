import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder, Logger, UserInfo, Login } from '../../core';
import { ApiConstant, CustomHttpErrorResponse, PaginateOptions } from '../../types';
import { API_TOKEN, AuthenticateInfo, NotificationResult, TokenPayload } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class AuthService {
    authUrl = `${this.apiConstants.endpoint}/auth`;

    private isLoginSub$ = new BehaviorSubject(this.isLogin());
    isLogin$ = this.isLoginSub$.asObservable();

    private userSub$ = new BehaviorSubject<UserInfo | null>(this.getUser());
    user$ = this.userSub$.asObservable();

    private loginErrorSub$ = new Subject<string[]>();
    loginError$ = this.loginErrorSub$.asObservable();

    private contactUsErrorSub$ = new Subject<string[]>();
    contactUsError$ = this.contactUsErrorSub$.asObservable();

    private closeSideNavSub$ = new Subject();
    closeSideNav$ = this.closeSideNavSub$.asObservable();

    private tmpRedirectUrl = '';

    private checkAccessSub$ = new Subject<boolean>();

    private disableBlockchainSub$ = new Subject<boolean>();
    disableBlockchain$ = this.disableBlockchainSub$.asObservable();

    private menuNotificationSub$ = new Subject<NotificationResult>();
    menuNotification$ = this.menuNotificationSub$.asObservable();

    private numberOfNewNotiSub$ = new Subject<number>();
    numberOfNewNoti$ = this.numberOfNewNotiSub$.asObservable();

    private menuSub$ = new Subject<number>();
    menu$ = this.menuSub$.asObservable();

    constructor(
        @Inject(API_TOKEN) private apiConstants: ApiConstant,
        private httpClient: HttpClient,
        private router: Router,
    ) {}

    get redirectUrl() {
        return this.tmpRedirectUrl;
    }

    set redirectUrl(value: string) {
        this.tmpRedirectUrl = value;
    }

    get checkAccess$() {
        return this.checkAccessSub$.asObservable();
    }

    login(input: AuthenticateInfo) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Login' });
        input.isPersisMission = true;
        return this.httpClient
            .post<Login>(`${this.authUrl}/login`, input, {
                responseType: 'json',
                headers,
            })
            .pipe(
                tap(({ response }: Login) => {
                    localStorage.setItem('jwt', response.accessToken);
                    const user = this.getUser();
                    this.userSub$.next(user);
                    this.isLoginSub$.next(true);
                    switch (user?.role) {
                        case 'user':
                        case 'admin':
                            this.router.navigateByUrl('/Dashboard');
                            break;
                        default:
                            this.router.navigateByUrl('/not-found');
                    }
                }),
                catchError((err: CustomHttpErrorResponse) => {
                    this.isLoginSub$.next(false);
                    if (err.errorJson) {
                        this.loginErrorSub$.next(err.errorJson.message);
                    } else {
                        this.loginErrorSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            );
    }

    isLogin() {
        return this.getJWT() != null;
    }

    invalidateSession() {
        localStorage.removeItem('jwt');
        this.isLoginSub$.next(false);
        this.loginErrorSub$.next([]);
        this.userSub$.next(null);
    }

    logout() {
        this.invalidateSession();
        this.router.navigate(['/login']);
        this.closeSideNavSub$.next();
    }

    getJWT() {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                return null;
            }
            const token: TokenPayload = jwt_decode(jwt);
            const isExpired = Date.now() > token.exp * 1000;
            if (isExpired) {
                localStorage.removeItem('jwt');
                return null;
            }
            return jwt;
        } catch {
            localStorage.removeItem('jwt');
            return null;
        }
    }

    getUser(): UserInfo | null {
        const jwt = this.getJWT();
        if (!jwt) {
            return null;
        }

        const {
            id,
            username,
            firstname,
            lastname,
            fullname,
            email,
            role,
            lastLoginTime,
            status,
            genderId,
            genderName,
            countryId,
            countryName,
            educationId,
            educationName,
            address,
            dob,
            phoneNumber,
        } = jwt_decode<TokenPayload>(jwt);

        return {
            id,
            username,
            firstname,
            lastname,
            fullname,
            email,
            role,
            lastLoginTime,
            status,
            genderId,
            genderName,
            countryId,
            countryName,
            educationId,
            educationName,
            address,
            dob,
            phoneNumber,
        };
    }

    checkAccess(url: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Check access right' });
        const params = new HttpParams({ encoder: new CustomEncoder() }).set('url', url);

        this.httpClient
            .get<boolean>(`${this.authUrl}/check-access`, { headers, params })
            .pipe(
                tap((result: boolean) => {
                    Logger.log('checkAccess boolResult', result);
                    this.checkAccessSub$.next(result);
                }),
                catchError(err => {
                    Logger.log('checkAccess exception', err);
                    this.checkAccessSub$.next(false);
                    return EMPTY;
                }),
            )
            .subscribe();
    }

    isBlockchainDisabled() {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Check whether or not blockchain is disabled' });

        this.httpClient
            .get<{ disabled: boolean }>(`${this.authUrl}/disable-blockchain`, { headers })
            .pipe(
                tap(({ disabled }) => {
                    this.disableBlockchainSub$.next(disabled);
                }),
                catchError(err => {
                    Logger.log('isBlockchainDisabled exception', err);
                    this.disableBlockchainSub$.next(false);
                    return EMPTY;
                }),
            )
            .subscribe();
    }
    getNotification(options: PaginateOptions): Observable<NotificationResult> {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Get all notification' });
        let params = new HttpParams();

        const { pageIndex, pageSize } = options;
        params = params.set('page', `${pageIndex}`).set('limit', `${pageSize}`);
        return this.httpClient
            .get<NotificationResult>(`${this.apiConstants.endpoint}/notification`, { params, headers })
            .pipe(
                tap(result => {
                    if (result) {
                        this.menuNotificationSub$.next(result);
                    }
                }),
            );
    }

    updateUserLanguage(userId: string, currentLanguageCode?: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'update user language' });
        const userI = { userId, languageCode: currentLanguageCode };
        return this.httpClient
            .post(`${this.authUrl}/update-user-language`, userI, {
                headers,
                responseType: 'text',
            })
            .pipe(
                tap((jwt: any) => {
                    localStorage.setItem('jwt', jwt);
                    const user = this.getUser();
                    this.userSub$.next(user);
                }),
            )
            .subscribe();
    }

    getNumberOfNewNotification(): Observable<any> {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Get number of new notification' });
        return this.httpClient.get<any>(`${this.apiConstants.endpoint}/notification/new`, { headers }).pipe(
            tap(result => {
                if (result) {
                    this.numberOfNewNotiSub$.next(result.response.newNoti);
                }
            }),
        );
    }

    markAllReadNotification() {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Mark all read notification' });
        return this.httpClient.put<any>(`${this.apiConstants.endpoint}/notification/mark-all-old`, { headers }).pipe();
    }

    markItemReadNotification(notiId: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Mark item read notification' });
        return this.httpClient.put<any>(`${this.apiConstants.endpoint}/notification/` + notiId, { headers }).pipe();
    }

    getMenu() {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Get items Menu' });
        return this.httpClient.get<any>(`${this.apiConstants.endpoint}/menu/get-menu`, { headers }).pipe(
            tap(result => {
                if (result) {
                    this.menuSub$.next(result?.response?.menus);
                }
            }),
        );
    }
}
