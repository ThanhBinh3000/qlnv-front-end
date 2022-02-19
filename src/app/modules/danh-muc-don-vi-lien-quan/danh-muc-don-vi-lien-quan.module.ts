import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucDonViLienQuanLazyModule } from './danh-muc-don-vi-lien-quan-lazy.module';
import { DanhMucDonViLienQuanService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { API_TOKEN } from '..';

@NgModule({
    imports: [DanhMucDonViLienQuanLazyModule, FlexLayoutModule,],
    exports: [DanhMucDonViLienQuanLazyModule, FlexLayoutModule,],
})
export class DanhMucDonViLienQuanModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucDonViLienQuanModule> {
        return {
            ngModule: DanhMucDonViLienQuanModule,
            providers: [
                {
                    provide: API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucDonViLienQuanService,
            ],
        };
    }
}
