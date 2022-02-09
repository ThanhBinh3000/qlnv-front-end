import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApiConstant } from '../types';
import { DashboardLazyModule } from './dashboard-lazy.module';
import { DashboardService } from './services/dashboard.service';
import { DASHBOARD_API_TOKEN } from './type';

@NgModule({
    imports: [DashboardLazyModule],
    exports: [DashboardLazyModule],
})
export class DashboardModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DashboardModule> {
        return {
            ngModule: DashboardModule,
            providers: [{
                provide: DASHBOARD_API_TOKEN,
                useValue: apiConstant
            }, DashboardService],
        };
    }
}
