import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucDonViLienQuan, ThemSuaDanhMucDonViLienQuan } from './components';
import { DanhMucDonViLienQuanContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucDonViLienQuanContainer, DanhSachDanhMucDonViLienQuan, ThemSuaDanhMucDonViLienQuan],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucDonViLienQuanContainer, DanhSachDanhMucDonViLienQuan, ThemSuaDanhMucDonViLienQuan],
})
export class DanhMucDonViLienQuanLazyModule {}
