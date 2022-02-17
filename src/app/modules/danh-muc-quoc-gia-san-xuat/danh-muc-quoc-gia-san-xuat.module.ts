import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucQuocGiaSanXuatLazyModule } from './danh-muc-quoc-gia-san-xuat-lazy.module';
import { DanhMucQuocGiaSanXuatService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { API_TOKEN } from '..';

@NgModule({
    imports: [DanhMucQuocGiaSanXuatLazyModule, FlexLayoutModule,],
    exports: [DanhMucQuocGiaSanXuatLazyModule, FlexLayoutModule,],
})
export class DanhMucQuocGiaSanXuatModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucQuocGiaSanXuatModule> {
        return {
            ngModule: DanhMucQuocGiaSanXuatModule,
            providers: [
                {
                    provide: API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucQuocGiaSanXuatService,
            ],
        };
    }
}
