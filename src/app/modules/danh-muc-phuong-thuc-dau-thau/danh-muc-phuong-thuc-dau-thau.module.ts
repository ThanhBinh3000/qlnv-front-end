import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucPhuongThucDauThauLazyModule } from './danh-muc-phuong-thuc-dau-thau-lazy.module';
import { DanhMucPhuongThucDauThauService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { API_TOKEN } from '..';

@NgModule({
    imports: [DanhMucPhuongThucDauThauLazyModule, FlexLayoutModule,],
    exports: [DanhMucPhuongThucDauThauLazyModule, FlexLayoutModule,],
})
export class DanhMucPhuongThucDauThauModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucPhuongThucDauThauModule> {
        return {
            ngModule: DanhMucPhuongThucDauThauModule,
            providers: [
                {
                    provide: API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucPhuongThucDauThauService,
            ],
        };
    }
}
