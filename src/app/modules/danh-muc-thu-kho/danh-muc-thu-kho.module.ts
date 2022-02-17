import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucThuKhoLazyModule } from './danh-muc-thu-kho-lazy.module';
import { DanhMucThuKhoService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { API_TOKEN } from '..';

@NgModule({
    imports: [DanhMucThuKhoLazyModule, FlexLayoutModule,],
    exports: [DanhMucThuKhoLazyModule, FlexLayoutModule,],
})
export class DanhMucThuKhoModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucThuKhoModule> {
        return {
            ngModule: DanhMucThuKhoModule,
            providers: [
                {
                    provide: API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucThuKhoService,
            ],
        };
    }
}
