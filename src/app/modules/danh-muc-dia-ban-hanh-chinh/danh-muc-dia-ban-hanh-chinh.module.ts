import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucDiaBanHanhChinhLazyModule } from './danh-muc-dia-ban-hanh-chinh-lazy.module';
import { Danh_Muc_Dia_Ban_Hanh_Chinh_API_TOKEN } from './types';
import { DanhMucDiaBanHanhChinhService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucDiaBanHanhChinhLazyModule, FlexLayoutModule],
    exports: [DanhMucDiaBanHanhChinhLazyModule, FlexLayoutModule,],
})
export class DanhMucDiaBanHanhChinhModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucDiaBanHanhChinhModule> {
        return {
            ngModule: DanhMucDiaBanHanhChinhModule,
            providers: [
                {
                    provide: Danh_Muc_Dia_Ban_Hanh_Chinh_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucDiaBanHanhChinhService,
            ],
        };
    }
}
