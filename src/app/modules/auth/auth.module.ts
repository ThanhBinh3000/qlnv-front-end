import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApiConstant } from '../index';
import { AuthLazyModule } from './auth-lazy.module';
import { AuthInterceptor, AuthService } from './services';
import { API_TOKEN } from './types';

@NgModule({
    imports: [AuthLazyModule],
    exports: [AuthLazyModule],
})
export class AuthModule {
    static forRoot(apiConstantt: ApiConstant): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                { provide: API_TOKEN, useValue: apiConstantt },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                AuthService,
            ],
        };
    }
}
