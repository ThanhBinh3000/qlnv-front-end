import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApiConstant } from '../types';
import { QuanLyNguoiDungLazyModule } from './quan-ly-nguoi-dung-lazy.module';
import { QL_Nguoi_Dung_API_TOKEN } from './types';
import { QuanLyNguoiDungService } from './services';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [QuanLyNguoiDungLazyModule, FlexLayoutModule,],
    exports: [QuanLyNguoiDungLazyModule, FlexLayoutModule,],
})
export class QuanLyNguoiDungModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<QuanLyNguoiDungModule> {
        return {
            ngModule: QuanLyNguoiDungModule,
            providers: [
                {
                    provide: QL_Nguoi_Dung_API_TOKEN,
                    useValue: apiConstant,
                },
                QuanLyNguoiDungService,
            ],
        };
    }
}
