import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { DanhMucTinhTrangGoiThauLazyModule as DanhMucTinhTrangGoiThauLazyModule } from './danh-muc-tinh-trang-goi-thau-lazy.module';
import { DanhMucTinhTrangGoiThauService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { API_TOKEN } from '..';

@NgModule({
    imports: [DanhMucTinhTrangGoiThauLazyModule, FlexLayoutModule,],
    exports: [DanhMucTinhTrangGoiThauLazyModule, FlexLayoutModule,],
})
export class DanhMucTinhTrangGoiThauModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<DanhMucTinhTrangGoiThauModule> {
        return {
            ngModule: DanhMucTinhTrangGoiThauModule,
            providers: [
                {
                    provide: API_TOKEN,
                    useValue: apiConstant,
                },
                DanhMucTinhTrangGoiThauService,
            ],
        };
    }
}
