import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucKyBaoQuanLazyModule } from './danh-muc-ky-bao-quan-lazy.module';
import { Danh_Muc_Ky_Bao_Quan_API_TOKEN } from './types';
import { DanhMucKyBaoQuanService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucKyBaoQuanLazyModule, FlexLayoutModule],
    exports: [DanhMucKyBaoQuanLazyModule, FlexLayoutModule,],
})
export class DanhMucKyBaoQuanModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucKyBaoQuanModule> {
        return {
            ngModule: DanhMucKyBaoQuanModule,
            providers: [
                {
                    provide: Danh_Muc_Ky_Bao_Quan_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucKyBaoQuanService,
            ],
        };
    }
}
