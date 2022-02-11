import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucDonViTinhLazyModule } from './danh-muc-don-vi-tinh-lazy.module';
import { Danh_Muc_Don_Vi_Tinh_API_TOKEN } from './types';
import { DanhMucDonViTinhService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucDonViTinhLazyModule, FlexLayoutModule,],
    exports: [DanhMucDonViTinhLazyModule, FlexLayoutModule,],
})
export class DanhMucDonViTinhModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucDonViTinhModule> {
        return {
            ngModule: DanhMucDonViTinhModule,
            providers: [
                {
                    provide: Danh_Muc_Don_Vi_Tinh_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucDonViTinhService,
            ],
        };
    }
}
