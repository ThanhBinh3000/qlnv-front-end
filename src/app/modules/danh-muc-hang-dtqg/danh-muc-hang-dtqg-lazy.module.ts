import { DanhMucHangDtqgContainer } from './containers/danh-muc-hang-dtqg.container';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucHangDtqg, ThemSuaDanhMucHangDtqg } from './components';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucHangDtqgContainer, DanhSachDanhMucHangDtqg, ThemSuaDanhMucHangDtqg],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucHangDtqgContainer, DanhSachDanhMucHangDtqg, ThemSuaDanhMucHangDtqg],
})
export class DanhMucHangDtqgLazyModule {}
