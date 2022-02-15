import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucLoaiHinhKhoTangLazyModule } from './danh-muc-loai-hinh-kho-tang-lazy.module';
import { Danh_Muc_Loai_Hinh_Kho_Tang_API_TOKEN } from './types';
import { DanhMucLoaiHinhKhoTangService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucLoaiHinhKhoTangLazyModule, FlexLayoutModule,],
    exports: [DanhMucLoaiHinhKhoTangLazyModule, FlexLayoutModule,],
})
export class DanhMucLoaiHinhKhoTangModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucLoaiHinhKhoTangModule> {
        return {
            ngModule: DanhMucLoaiHinhKhoTangModule,
            providers: [
                {
                    provide: Danh_Muc_Loai_Hinh_Kho_Tang_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucLoaiHinhKhoTangService,
            ],
        };
    }
}
