import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucHangDtqgLazyModule } from './danh-muc-hang-dtqg-lazy.module';
import { Danh_Muc_Hang_Dtqg_API_TOKEN } from './types';
import { DanhMucHangDtqgService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucHangDtqgLazyModule, FlexLayoutModule,],
    exports: [DanhMucHangDtqgLazyModule, FlexLayoutModule,],
})
export class DanhMucHangDtqgModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucHangDtqgModule> {
        return {
            ngModule: DanhMucHangDtqgModule,
            providers: [
                {
                    provide: Danh_Muc_Hang_Dtqg_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucHangDtqgService,
            ],
        };
    }
}
