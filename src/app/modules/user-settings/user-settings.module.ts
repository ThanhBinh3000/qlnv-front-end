import { ModuleWithProviders, NgModule } from '@angular/core';
import { MyAccountService } from './services';
import { ApiConstant } from '../types';
import { UserSettingsLazyModule } from './user-settings-lazy.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { US_API_TOKEN } from '.';

@NgModule({
    imports: [UserSettingsLazyModule, FlexLayoutModule],
    exports: [UserSettingsLazyModule, FlexLayoutModule],
})
export class UserSettingsModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<UserSettingsModule> {
        return {
            ngModule: UserSettingsModule,
            providers: [
                {
                    provide: US_API_TOKEN,
                    useValue: apiConstant,
                },
                MyAccountService,
            ],
        };
    }
}
