import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { Danh_Muc_Loai_Hinh_Nhap_Xuat_API_TOKEN } from './types';
import { DanhMucLoaiHinhNhapXuatService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DanhMucLoaiHinhNhapXuatLazyModule } from './danh-muc-Loai-hinh-nhap-xuat-lazy.module';

@NgModule({
    imports: [DanhMucLoaiHinhNhapXuatLazyModule, FlexLayoutModule],
    exports: [DanhMucLoaiHinhNhapXuatLazyModule, FlexLayoutModule,],
})
export class DanhMucLoaiHinhNHapXuatModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucLoaiHinhNHapXuatModule> {
        return {
            ngModule: DanhMucLoaiHinhNHapXuatModule,
            providers: [
                {
                    provide: Danh_Muc_Loai_Hinh_Nhap_Xuat_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucLoaiHinhNhapXuatService,
            ],
        };
    }
}
