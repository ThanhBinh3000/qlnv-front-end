import { ThemSuaDanhMucDiaBanHanhChinh } from './components/them-sua-danh-muc-dia-ban-hanh-chinh/them-sua-danh-muc-dia-ban-hanh-chinh.component';
import { DanhSachDanhMucDiaBanHanhChinh } from './components/danh-sach-danh-muc-dia-ban-hanh-chinh/danh-sach-danh-muc-dia-ban-hanh-chinh.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucPhuongXa, DanhSachDanhMucQuanHuyen, ThemSuaDanhMucPhuongXa, ThemSuaDanhMucQuanHuyen } from './components';
import { DanhMucDiaBanHanhChinhContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DanhMucQuanHuyenContainer } from './containers/danh-muc-quan-huyen.container';
import { DanhMucPhuongXaContainer } from './containers/danh-muc-phuong-xa.container';

@NgModule({
    declarations: [
        DanhMucDiaBanHanhChinhContainer,
        DanhMucQuanHuyenContainer,
        DanhMucPhuongXaContainer,
        DanhSachDanhMucQuanHuyen,
        ThemSuaDanhMucQuanHuyen,
        DanhSachDanhMucDiaBanHanhChinh,
        ThemSuaDanhMucDiaBanHanhChinh,
        DanhSachDanhMucPhuongXa,
        ThemSuaDanhMucPhuongXa,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        NzButtonModule,
        NzSelectModule,
    ],
    exports: [
        DanhMucDiaBanHanhChinhContainer,
        DanhMucQuanHuyenContainer,
        DanhMucPhuongXaContainer,
        DanhSachDanhMucQuanHuyen,
        ThemSuaDanhMucQuanHuyen,
        DanhSachDanhMucDiaBanHanhChinh,
        ThemSuaDanhMucDiaBanHanhChinh,
        DanhSachDanhMucPhuongXa,
        ThemSuaDanhMucPhuongXa,
    ],
})
export class DanhMucDiaBanHanhChinhLazyModule {}
