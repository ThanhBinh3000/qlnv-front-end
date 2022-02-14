import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucDonViCuuTro, ThemSuaDanhMucDonViCuutro } from './components';
import { DanhMucDonViCuuTroContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
    declarations: [DanhMucDonViCuuTroContainer, DanhSachDanhMucDonViCuuTro, ThemSuaDanhMucDonViCuutro],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        NzButtonModule,
        NzSelectModule,
    ],
    exports: [DanhMucDonViCuuTroContainer, DanhSachDanhMucDonViCuuTro, ThemSuaDanhMucDonViCuutro],
})
export class DanhMucDonViCuuTroLazyModule {}
