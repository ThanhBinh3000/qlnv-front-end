import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucTinhTrangGoiThau, ThemSuaDanhMucTinhTrangGoiThau } from './components';
import { DanhMucTinhTrangGoiThauContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucTinhTrangGoiThauContainer, DanhSachDanhMucTinhTrangGoiThau, ThemSuaDanhMucTinhTrangGoiThau],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucTinhTrangGoiThauContainer, DanhSachDanhMucTinhTrangGoiThau, ThemSuaDanhMucTinhTrangGoiThau],
})
export class DanhMucTinhTrangGoiThauLazyModule {}
