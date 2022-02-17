import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhMucPhuongThucBaoQuanContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DanhSachDanhMucPhuongThucBaoQuan, ThemSuaDanhMucPhuongThucBaoQuan } from './components';

@NgModule({
    declarations: [DanhMucPhuongThucBaoQuanContainer, DanhSachDanhMucPhuongThucBaoQuan, ThemSuaDanhMucPhuongThucBaoQuan],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        NzButtonModule,
        NzSelectModule,
    ],
    exports: [DanhMucPhuongThucBaoQuanContainer, DanhSachDanhMucPhuongThucBaoQuan, ThemSuaDanhMucPhuongThucBaoQuan],
})
export class DanhMucPhuongThucBaoQuanLazyModule {}
