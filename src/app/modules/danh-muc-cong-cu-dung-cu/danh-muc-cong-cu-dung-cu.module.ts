import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucCongCuDungCuLazyModule } from './danh-muc-cong-cu-dung-cu-lazy.module';
import { Danh_Muc_Cong_Cu_Dung_Cu_API_TOKEN } from './types';
import { DanhMucCongCuDungCuService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucCongCuDungCuLazyModule, FlexLayoutModule,],
    exports: [DanhMucCongCuDungCuLazyModule, FlexLayoutModule,],
})
export class DanhMucCongCuDungCuModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucCongCuDungCuModule> {
        return {
            ngModule: DanhMucCongCuDungCuModule,
            providers: [
                {
                    provide: Danh_Muc_Cong_Cu_Dung_Cu_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucCongCuDungCuService,
            ],
        };
    }
}
