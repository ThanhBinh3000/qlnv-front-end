import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucThuKho, ThemSuaDanhMucThuKho } from './components';
import { DanhMucThuKhoContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucThuKhoContainer, DanhSachDanhMucThuKho, ThemSuaDanhMucThuKho],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucThuKhoContainer, DanhSachDanhMucThuKho, ThemSuaDanhMucThuKho],
})
export class DanhMucThuKhoLazyModule {}
