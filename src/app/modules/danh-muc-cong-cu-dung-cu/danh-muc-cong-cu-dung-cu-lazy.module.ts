import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucCongCuDungCu, ThemSuaDanhMucCongCuDungCu } from './components';
import { DanhMucCongCuDungCuContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucCongCuDungCuContainer, DanhSachDanhMucCongCuDungCu, ThemSuaDanhMucCongCuDungCu],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucCongCuDungCuContainer, DanhSachDanhMucCongCuDungCu, ThemSuaDanhMucCongCuDungCu],
})
export class DanhMucCongCuDungCuLazyModule {}
