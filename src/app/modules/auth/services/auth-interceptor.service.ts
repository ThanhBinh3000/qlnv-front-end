import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ConfirmationDialog } from '../../shared/dialogs/confirmation-dialog';
import { augmentErrorResponse } from './auth-interceptor-helper';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private spinner: NgxSpinnerService, 
        private dialog: MatDialog,
        private toastr: ToastrService) {}
    private unsubscribe$ = new Subject();
    private handleError(error: HttpErrorResponse, isPersisMission: boolean = false) {
        switch (error.status) {
            case 401:
            case 403:
                this.authService.logout();
                this.spinner.hide();
                if (!isPersisMission) {
                    this.spinner.hide();
                    this.toastr.success('Lỗi thực thi', error.message || 'Có lỗi trong quá trình thực thi.');
                }
                break;
            default:
                this.toastr.success('Lỗi thực thi', error.message || 'Có lỗi trong quá trình thực thi.');
                break;
        }

        return throwError(error);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwt = this.authService.getJWT();
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
