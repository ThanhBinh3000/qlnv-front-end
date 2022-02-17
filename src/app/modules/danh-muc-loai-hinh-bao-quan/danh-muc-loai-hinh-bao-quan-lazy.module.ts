import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucLoaiHinhBaoQuan, ThemSuaDanhMucLoaiHinhBaoQuan } from './components';
import { DanhMucLoaiHinhBaoQuanContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucLoaiHinhBaoQuanContainer, DanhSachDanhMucLoaiHinhBaoQuan, ThemSuaDanhMucLoaiHinhBaoQuan],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucLoaiHinhBaoQuanContainer, DanhSachDanhMucLoaiHinhBaoQuan, ThemSuaDanhMucLoaiHinhBaoQuan],
})
export class DanhMucLoaiHinhBaoQuanLazyModule {}
