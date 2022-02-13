import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { TrangChuLazyModule } from './trang-chu-lazy.module';
import { TRANG_CHU_API_TOKEN } from './types';
import { TrangChuService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [TrangChuLazyModule, FlexLayoutModule,],
    exports: [TrangChuLazyModule, FlexLayoutModule,],
})
export class TrangChuModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<TrangChuModule> {
        return {
            ngModule: TrangChuModule,
            providers: [
                {
                    provide: TRANG_CHU_API_TOKEN,
                    useValue: apiConstant,
                },
                TrangChuService,
            ],
        };
    }
}
