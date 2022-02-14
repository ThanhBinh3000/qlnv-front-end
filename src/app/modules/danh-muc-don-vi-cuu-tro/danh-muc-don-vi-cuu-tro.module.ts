import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucDonViCuuTroLazyModule } from './danh-muc-don-vi-cuu-tro-lazy.module';
import { Danh_Muc_Don_Vi_Cuu_Tro_API_TOKEN } from './types';
import { DanhMucDonViCuuTroService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucDonViCuuTroLazyModule, FlexLayoutModule],
    exports: [DanhMucDonViCuuTroLazyModule, FlexLayoutModule,],
})
export class DanhMucDonViCuuTroModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucDonViCuuTroModule> {
        return {
            ngModule: DanhMucDonViCuuTroModule,
            providers: [
                {
                    provide: Danh_Muc_Don_Vi_Cuu_Tro_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucDonViCuuTroService,
            ],
        };
    }
}
