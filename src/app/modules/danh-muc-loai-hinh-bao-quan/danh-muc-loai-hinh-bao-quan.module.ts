import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucLoaiHinhBaoQuanLazyModule } from './danh-muc-loai-hinh-bao-quan-lazy.module';
import { DanhMucLoaiHinhBaoQuanService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { API_TOKEN } from '..';

@NgModule({
    imports: [DanhMucLoaiHinhBaoQuanLazyModule, FlexLayoutModule,],
    exports: [DanhMucLoaiHinhBaoQuanLazyModule, FlexLayoutModule,],
})
export class DanhMucLoaiHinhBaoQuanModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucLoaiHinhBaoQuanModule> {
        return {
            ngModule: DanhMucLoaiHinhBaoQuanModule,
            providers: [
                {
                    provide: API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucLoaiHinhBaoQuanService,
            ],
        };
    }
}
