import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucQuocGiaSanXuat, ThemSuaDanhMucQuocGiaSanXuat } from './components';
import { DanhMucQuocGiaSanXuatContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucQuocGiaSanXuatContainer, DanhSachDanhMucQuocGiaSanXuat, ThemSuaDanhMucQuocGiaSanXuat],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucQuocGiaSanXuatContainer, DanhSachDanhMucQuocGiaSanXuat, ThemSuaDanhMucQuocGiaSanXuat],
})
export class DanhMucQuocGiaSanXuatLazyModule {}
