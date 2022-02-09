import { ModuleWithProviders, NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthModule } from '../auth';
import { ApiConstant } from '../types';
import { AdminLazyModule } from './admin-lazy.module';
import { ADMIN_API_TOKEN } from './admin-type';
import { AdminService } from './services';
@NgModule({
    imports: [AdminLazyModule, AuthModule.forRoot(environment.api),],
    exports: [AdminLazyModule],
    declarations: [],
})
export class AdminModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<AdminModule> {
        return {
            ngModule: AdminModule,
            providers: [
                {
                    provide: ADMIN_API_TOKEN,
                    useValue: apiConstant,
                },
                AdminService,
            ],
        };
    }
}
