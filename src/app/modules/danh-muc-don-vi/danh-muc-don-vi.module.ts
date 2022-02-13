import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucDonViLazyModule } from './danh-muc-don-vi-lazy.module';
import { Danh_Muc_Don_Vi_API_TOKEN } from './types';
import { DanhMucDonViService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucDonViLazyModule, FlexLayoutModule],
    exports: [DanhMucDonViLazyModule, FlexLayoutModule,],
})
export class DanhMucDonViModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucDonViModule> {
        return {
            ngModule: DanhMucDonViModule,
            providers: [
                {
                    provide: Danh_Muc_Don_Vi_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucDonViService,
            ],
        };
    }
}
