import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucPhuongThucBaoQuanLazyModule } from './danh-muc-phuong-thuc-bao-quan-lazy.module';
import { Danh_Muc_Phuong_Thuc_Bao_Quan_API_TOKEN } from './types';
import { DanhMucPhuongThucBaoQuanService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucPhuongThucBaoQuanLazyModule, FlexLayoutModule],
    exports: [DanhMucPhuongThucBaoQuanLazyModule, FlexLayoutModule,],
})
export class DanhMucPhuongThucBaoQuanModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucPhuongThucBaoQuanModule> {
        return {
            ngModule: DanhMucPhuongThucBaoQuanModule,
            providers: [
                {
                    provide: Danh_Muc_Phuong_Thuc_Bao_Quan_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucPhuongThucBaoQuanService,
            ],
        };
    }
}
