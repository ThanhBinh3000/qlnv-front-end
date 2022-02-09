import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { EmployeeLazyModule } from './employee-lazy.module';
import { EMPLOYEE_API_TOKEN } from './types';
import { EmployeeService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [EmployeeLazyModule, FlexLayoutModule,],
    exports: [EmployeeLazyModule, FlexLayoutModule,],
})
export class EmployeeModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<EmployeeModule> {
        return {
            ngModule: EmployeeModule,
            providers: [
                {
                    provide: EMPLOYEE_API_TOKEN,
                    useValue: apiConstant,
                },
                EmployeeService,
            ],
        };
    }
}
