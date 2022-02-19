import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucHinhThucBaoQuanLazyModule } from './danh-muc-hinh-thuc-bao-quan-lazy.module';
import { DanhMucHinhThucBaoQuanService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { API_TOKEN } from '..';

@NgModule({
    imports: [DanhMucHinhThucBaoQuanLazyModule, FlexLayoutModule,],
    exports: [DanhMucHinhThucBaoQuanLazyModule, FlexLayoutModule,],
})
export class DanhMucHinhThucBaoQuanModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucHinhThucBaoQuanModule> {
        return {
            ngModule: DanhMucHinhThucBaoQuanModule,
            providers: [
                {
                    provide: API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucHinhThucBaoQuanService,
            ],
        };
    }
}
