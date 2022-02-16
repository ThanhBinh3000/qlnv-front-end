import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucKyBaoQuan, ThemSuaDanhMucKyBaoQuan } from './components';
import { DanhMucKyBaoQuanContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
    declarations: [DanhMucKyBaoQuanContainer, DanhSachDanhMucKyBaoQuan, ThemSuaDanhMucKyBaoQuan],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        NzButtonModule,
        NzSelectModule,
    ],
    exports: [DanhMucKyBaoQuanContainer, DanhSachDanhMucKyBaoQuan, ThemSuaDanhMucKyBaoQuan],
})
export class DanhMucKyBaoQuanLazyModule {}
