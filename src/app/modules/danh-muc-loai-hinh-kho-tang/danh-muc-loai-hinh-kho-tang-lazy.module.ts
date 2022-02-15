import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucLoaiHinhKhoTang, ThemSuaDanhMucLoaiHinhKhoTang } from './components';
import { DanhMucLoaiHinhKhoTangContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucLoaiHinhKhoTangContainer, DanhSachDanhMucLoaiHinhKhoTang, ThemSuaDanhMucLoaiHinhKhoTang],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucLoaiHinhKhoTangContainer, DanhSachDanhMucLoaiHinhKhoTang, ThemSuaDanhMucLoaiHinhKhoTang],
})
export class DanhMucLoaiHinhKhoTangLazyModule {}
