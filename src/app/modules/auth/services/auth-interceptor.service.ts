import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { augmentErrorResponse } from './auth-interceptor-helper';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private spinner: NgxSpinnerService) {}

    private handleError(error: HttpErrorResponse, isPersisMission: boolean = false) {
        if (error.status === 401 || error.status === 403) {
            this.authService.logout();
            this.spinner.hide();
            if (!isPersisMission) {
                return EMPTY;
            }
        }
        const errorResponse = augmentErrorResponse(error);
        return throwError(errorResponse);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const jwt = this.authService.getJWT();
        const jwt = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6IjEiLCJleHAiOjE2NDQ1MTM2ODV9.vLSFu-Mc9PkCqMjVFOQ__cD-NNWViRVgiz4j1ESEqKV8nCxA_dYHkGfO7NjWILN2WXe8UM9qBSTeIIYNVWXm6A'
        const isPersisMission = req.body?.isPersisMission;
        if (!jwt) {
            return next
                .handle(req)
                .pipe(catchError((error: HttpErrorResponse) => this.handleError(error, isPersisMission)));
        }

        const headers: { [key: string]: string } =
            req.body instanceof FormData
                ? { Authorization: `Bearer ${jwt}` }
                : {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${jwt}`,
                  };

        req = req.clone({
            setHeaders: headers,
        });

        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
    }
}
