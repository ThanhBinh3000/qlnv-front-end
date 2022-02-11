import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucDonVi, ThemSuaDanhMucDonVi } from './components';
import { DanhMucDonViContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucDonViContainer, DanhSachDanhMucDonVi, ThemSuaDanhMucDonVi],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucDonViContainer, DanhSachDanhMucDonVi, ThemSuaDanhMucDonVi],
})
export class DanhMucDonViLazyModule {}
