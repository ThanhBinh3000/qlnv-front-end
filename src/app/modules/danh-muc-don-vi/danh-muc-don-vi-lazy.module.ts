import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucDonVi, ThemSuaDanhMucDonVi } from './components';
import { DanhMucDonViContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
    declarations: [DanhMucDonViContainer, DanhSachDanhMucDonVi, ThemSuaDanhMucDonVi],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        NzButtonModule,
        NzSelectModule,
    ],
    exports: [DanhMucDonViContainer, DanhSachDanhMucDonVi, ThemSuaDanhMucDonVi],
})
export class DanhMucDonViLazyModule {}
