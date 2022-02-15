import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucKeLot, ThemSuaDanhMucKeLot } from './components';
import { DanhMucKeLotContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucKeLotContainer, DanhSachDanhMucKeLot, ThemSuaDanhMucKeLot],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucKeLotContainer, DanhSachDanhMucKeLot, ThemSuaDanhMucKeLot],
})
export class DanhMucKeLotLazyModule {}
