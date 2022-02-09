import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachNguoiDung, ThemSuaNguoiDung } from './components';
import { QuanLyNguoiDungContainer } from './containers';

@NgModule({
    declarations: [QuanLyNguoiDungContainer, DanhSachNguoiDung, ThemSuaNguoiDung],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
    exports: [QuanLyNguoiDungContainer, DanhSachNguoiDung, ThemSuaNguoiDung],
})
export class QuanLyNguoiDungLazyModule {}
