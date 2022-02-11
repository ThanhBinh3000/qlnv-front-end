import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucDonViTinh, ThemSuaDanhMucDonViTinh } from './components';
import { DanhMucDonViTinhContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucDonViTinhContainer, DanhSachDanhMucDonViTinh, ThemSuaDanhMucDonViTinh],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucDonViTinhContainer, DanhSachDanhMucDonViTinh, ThemSuaDanhMucDonViTinh],
})
export class DanhMucDonViTinhLazyModule {}
