import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { QuanLyDanhMucHangDTQGLazyModule } from './quan-ly-danh-muc-hang-dtqg-lazy.module';
import { QL_Danh_Muc_Hang_DTQG_API_TOKEN } from './types';
import { QuanLyDanhMucHangDTQGService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
    imports: [
        QuanLyDanhMucHangDTQGLazyModule, 
        FlexLayoutModule
    ],
    exports: [QuanLyDanhMucHangDTQGLazyModule, FlexLayoutModule,],
})
export class QuanLyDanhMucHangDTQGModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<QuanLyDanhMucHangDTQGModule> {
        return {
            ngModule: QuanLyDanhMucHangDTQGModule,
            providers: [
                {
                    provide: QL_Danh_Muc_Hang_DTQG_API_TOKEN,
                    useValue: apiConstant,
                },
                QuanLyDanhMucHangDTQGService,
            ],
        };
    }
}
