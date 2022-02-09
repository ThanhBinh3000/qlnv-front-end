import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucHangDTQG, ThemSuaDanhMucHangDTQG } from './components';
import { QuanLyDanhMucHangDTQGContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [QuanLyDanhMucHangDTQGContainer, DanhSachDanhMucHangDTQG, ThemSuaDanhMucHangDTQG],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule
    ],
    exports: [QuanLyDanhMucHangDTQGContainer, DanhSachDanhMucHangDTQG, ThemSuaDanhMucHangDTQG],
})
export class QuanLyDanhMucHangDTQGLazyModule {}
