import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucKeLotLazyModule } from './danh-muc-ke-lot-lazy.module';
import { Danh_Muc_Ke_Lot_API_TOKEN } from './types';
import { DanhMucKeLotService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [DanhMucKeLotLazyModule, FlexLayoutModule,],
    exports: [DanhMucKeLotLazyModule, FlexLayoutModule,],
})
export class DanhMucKeLotModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucKeLotModule> {
        return {
            ngModule: DanhMucKeLotModule,
            providers: [
                {
                    provide: Danh_Muc_Ke_Lot_API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucKeLotService,
            ],
        };
    }
}
