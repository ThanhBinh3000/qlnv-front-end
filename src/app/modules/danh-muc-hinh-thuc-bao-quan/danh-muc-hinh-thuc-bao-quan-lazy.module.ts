import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucHinhThucBaoQuan, ThemSuaDanhMucHinhThucBaoQuan } from './components';
import { DanhMucHinhThucBaoQuanContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucHinhThucBaoQuanContainer, DanhSachDanhMucHinhThucBaoQuan, ThemSuaDanhMucHinhThucBaoQuan],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucHinhThucBaoQuanContainer, DanhSachDanhMucHinhThucBaoQuan, ThemSuaDanhMucHinhThucBaoQuan],
})
export class DanhMucHinhThucBaoQuanLazyModule {}
