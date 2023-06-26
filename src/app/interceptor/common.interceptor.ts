import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {tap} from 'rxjs/operators';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {OldResponseData} from '../interfaces/response';
import {ERROR_CODE, STATUS_CODE} from '../constants/config';
import {MESSAGE} from '../constants/message';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notification: NzNotificationService,
  ) {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getToken();
    if (accessToken) {
      let headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${accessToken}`,
      );
      if (
        !request.url.includes('UploadFile') &&
        !request.url.includes('import') &&
        !request.url.includes('upload-attachment') &&
        !request.url.includes('upload')
      ) {
        headers = headers.append('content-type', 'application/json');
      }
      request = request.clone({
        headers,
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const result = event.body as OldResponseData;
            if (
              result.success === false &&
              !(Object.values(ERROR_CODE).indexOf(result.error) > -1)
            ) {
              this.notification.error(MESSAGE.ERROR, result.error);
            }
          }
        },
        (err: any) => {
          if (err.status === STATUS_CODE.UNAUTHORIZED) {
            this.notification.warning(MESSAGE.ALERT, MESSAGE.UNAUTHORIZED_ERROR);
            this.authService.logout();
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      ),
    );
  }
}
