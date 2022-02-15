import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DanhSachDanhMucLoaiHinhNhapXuat, ThemSuaDanhMucLoaiHinhNhapXuat } from './components';
import { DanhMucLoaiHinhNhapXuatContainer } from './containers';

@NgModule({
    declarations: [DanhMucLoaiHinhNhapXuatContainer, DanhSachDanhMucLoaiHinhNhapXuat, ThemSuaDanhMucLoaiHinhNhapXuat],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        NzButtonModule,
        NzSelectModule,
    ],
    exports: [DanhMucLoaiHinhNhapXuatContainer, DanhSachDanhMucLoaiHinhNhapXuat, ThemSuaDanhMucLoaiHinhNhapXuat],
})
export class DanhMucLoaiHinhNhapXuatLazyModule {}
